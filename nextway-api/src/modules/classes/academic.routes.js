const router  = require('express').Router();
const { Class, Section, Subject } = require('../../models/Academic');
const User = require('../../models/User');
const { protect, roles } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/errorHandler');

// ── CLASSES ────────────────────────────────────────────────────────────────
router.get('/classes', protect, asyncHandler(async (req, res) => {
  const classes = await Class.find({ schoolId: req.schoolId, isActive: true }).sort({ orderIndex: 1, name: 1 });
  res.json({ success: true, classes });
}));

router.post('/classes', protect, roles('school_admin','principal'), asyncHandler(async (req, res) => {
  const cls = await Class.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, class: cls });
}));

// ── SECTIONS ───────────────────────────────────────────────────────────────
router.get('/sections', protect, asyncHandler(async (req, res) => {
  const { classId, academicYearId } = req.query;
  const filter = { schoolId: req.schoolId, isActive: true };
  if (classId)        filter.classId        = classId;
  if (academicYearId) filter.academicYearId = academicYearId;

  const sections = await Section.find(filter)
    .populate('classId', 'name')
    .populate('classTeacherId', 'name');
  res.json({ success: true, sections });
}));

router.post('/sections', protect, roles('school_admin','principal'), asyncHandler(async (req, res) => {
  const section = await Section.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, section });
}));

// ── SUBJECTS ────────────────────────────────────────────────────────────────
router.get('/subjects', protect, asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ schoolId: req.schoolId, isActive: true }).sort({ name: 1 });
  res.json({ success: true, subjects });
}));

router.post('/subjects', protect, roles('school_admin','principal'), asyncHandler(async (req, res) => {
  const subject = await Subject.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, subject });
}));

// ── USERS / STAFF ─────────────────────────────────────────────────────────
router.get('/users', protect, roles('school_admin','principal'), asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const filter = { schoolId: req.schoolId };
  if (role) filter.role = role;
  if (search) filter.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const users = await User.find(filter).select('-password -refreshTokens').sort({ createdAt: -1 });
  res.json({ success: true, users });
}));

router.post('/users', protect, roles('school_admin'),
  asyncHandler(async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    const tempPassword = password || `NextWay@${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await User.create({
      schoolId: req.schoolId,
      name, email, phone, role,
      password: tempPassword,
      mustChangePassword: !password,
    });

    res.status(201).json({
      success: true,
      user:    user.toSafeObject?.() || user,
      tempPassword: !password ? tempPassword : undefined,
    });
  })
);

router.put('/users/:id', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  const allowed = ['name','phone','role','isActive','password'];
  const updates = {};
  
  allowed.forEach(k => { 
    if (req.body[k] !== undefined) {
      updates[k] = req.body[k];
    }
  });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  // Check school ownership
  if (user.schoolId.toString() !== req.schoolId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  // Update fields (pre-save hook will hash password if changed)
  Object.assign(user, updates);
  await user.save();

  res.json({ success: true, user: user.toSafeObject(), message: 'User updated successfully' });
}));

// ── REPORTS ─────────────────────────────────────────────────────────────────
router.get('/reports/dashboard-stats', protect, asyncHandler(async (req, res) => {
  const Student    = require('../../models/Student');
  const Attendance = require('../../models/Attendance');
  const { FeeInvoice } = require('../../models/Fee');
  const { Leave } = require('../../models/Misc');

  const [totalStudents, activeStudents, totalTeachers, pendingLeaves, overdueInvoices] = await Promise.all([
    Student.countDocuments({ schoolId: req.schoolId }),
    Student.countDocuments({ schoolId: req.schoolId, status: 'active' }),
    User.countDocuments({ schoolId: req.schoolId, role: 'teacher', isActive: true }),
    Leave.countDocuments({ schoolId: req.schoolId, status: 'pending' }),
    FeeInvoice.countDocuments({ schoolId: req.schoolId, status: 'overdue' }),
  ]);

  // Today's attendance
  const today = new Date();
  const todayStart = new Date(today.setHours(0,0,0,0));
  const todayEnd   = new Date(today.setHours(23,59,59,999));
  const todayAtt   = await Attendance.find({ schoolId: req.schoolId, date: { $gte: todayStart, $lte: todayEnd } });
  let present = 0, total = 0;
  todayAtt.forEach(a => {
    a.records.forEach(r => {
      total++;
      if (r.status === 'present') present++;
    });
  });

  const feeStats = await FeeInvoice.aggregate([
    { $match: { schoolId: req.schoolId } },
    { $group: { _id: null, collected: { $sum: '$totalPaid' }, pending: { $sum: '$balance' } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalStudents,
      activeStudents,
      totalTeachers,
      pendingLeaves,
      overdueInvoices,
      todayAttendance: { present, total, percentage: total ? Math.round(present/total*100) : 0 },
      fees: feeStats[0] || { collected: 0, pending: 0 },
    },
  });
}));

module.exports = router;
