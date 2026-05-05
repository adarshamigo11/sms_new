const router  = require('express').Router();
const { body, query } = require('express-validator');
const Student  = require('../../models/Student');
const User     = require('../../models/User');
const { protect, roles, audit } = require('../../middleware/auth');
const { validate, asyncHandler } = require('../../middleware/errorHandler');
const { generateAdmissionNo } = require('../../utils/jwt');

const ALLOWED_ROLES = ['school_admin','principal','receptionist'];

// ── GET /students ──────────────────────────────────────────────────────────
router.get('/', protect, asyncHandler(async (req, res) => {
  const { classId, sectionId, status, search, page = 1, limit = 50 } = req.query;

  const filter = { schoolId: req.schoolId };
  if (classId)   filter.classId   = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (status)    filter.status    = status;
  if (search) {
    filter.$or = [
      { firstName:   { $regex: search, $options: 'i' } },
      { lastName:    { $regex: search, $options: 'i' } },
      { admissionNo: { $regex: search, $options: 'i' } },
    ];
  }

  const skip  = (Number(page) - 1) * Number(limit);
  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip).limit(Number(limit)),
    Student.countDocuments(filter),
  ]);

  res.json({ success: true, students, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

// ── GET /students/:id ──────────────────────────────────────────────────────
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id, schoolId: req.schoolId })
    .populate('classId', 'name')
    .populate('sectionId', 'name classTeacherId')
    .populate('userId', 'email phone');

  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student });
}));

// ── POST /students ─────────────────────────────────────────────────────────
router.post('/',
  protect, roles(...ALLOWED_ROLES),
  [
    body('firstName').trim().notEmpty().withMessage('First name required'),
    body('lastName').trim().notEmpty().withMessage('Last name required'),
    body('classId').notEmpty().withMessage('Class required'),
    body('gender').isIn(['Male','Female','Other']).withMessage('Invalid gender'),
    body('phone').optional().isMobilePhone('any'),
  ],
  validate,
  audit('CREATE', 'Student'),
  asyncHandler(async (req, res) => {
    const { firstName, lastName, classId, sectionId, gender, dateOfBirth, phone, email, bloodGroup, aadhaarNo, address, category, academicYearId } = req.body;

    // Generate admission number
    const count = await Student.countDocuments({ schoolId: req.schoolId });
    const year  = new Date().getFullYear();
    const admissionNo = generateAdmissionNo('NWA', year, count + 1);

    // Create login user for student
    const studentEmail = email || `${admissionNo.replace(/\//g,'').toLowerCase()}@student.nextway.edu`;
    const studentPassword = req.body.password || `Student@${admissionNo.replace(/\//g,'')}`;
    
    const userDoc = await User.create({
      schoolId: req.schoolId,
      name:     `${firstName} ${lastName}`,
      email:    studentEmail,
      password: studentPassword,
      role:     'student',
      mustChangePassword: req.body.password ? false : true, // Only require change if auto-generated
    });

    const student = await Student.create({
      schoolId: req.schoolId,
      userId:   userDoc._id,
      academicYearId: academicYearId || null,
      classId, sectionId, firstName, lastName,
      gender, dateOfBirth, phone, bloodGroup,
      aadhaarNo, address, category,
      admissionNo,
      admissionDate: new Date(),
    });

    res.locals.entityId = student._id.toString();
    res.status(201).json({ 
      success: true, 
      student, 
      tempPassword: studentPassword, 
      message: 'Student created. Share credentials with student/parent.' 
    });
  })
);

// ── PUT /students/:id ──────────────────────────────────────────────────────
router.put('/:id',
  protect, roles(...ALLOWED_ROLES),
  audit('UPDATE', 'Student'),
  asyncHandler(async (req, res) => {
    const allowed = ['firstName','lastName','classId','sectionId','gender','dateOfBirth','phone','bloodGroup','address','status','category','transportRouteId','hostelRoomId'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      updates, { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    res.locals.entityId = student._id.toString();
    res.json({ success: true, student });
  })
);

// ── DELETE /students/:id ───────────────────────────────────────────────────
router.delete('/:id',
  protect, roles('school_admin'),
  audit('DELETE', 'Student'),
  asyncHandler(async (req, res) => {
    // Soft delete
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      { status: 'inactive' }, { new: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deactivated' });
  })
);

// ── GET /students/:id/attendance-summary ──────────────────────────────────
router.get('/:id/attendance-summary', protect, asyncHandler(async (req, res) => {
  const Attendance = require('../../models/Attendance');
  const records = await Attendance.find({
    schoolId: req.schoolId,
    'records.studentId': req.params.id,
  }).select('date records.$');

  const total = records.length;
  const present = records.filter(r => r.records[0]?.status === 'present').length;
  const absent  = records.filter(r => r.records[0]?.status === 'absent').length;
  const late    = records.filter(r => r.records[0]?.status === 'late').length;

  res.json({ success: true, summary: { total, present, absent, late, percentage: total ? Math.round(present / total * 100) : 0 } });
}));

module.exports = router;
