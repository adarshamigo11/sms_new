const router     = require('express').Router();
const { body }   = require('express-validator');
const Attendance = require('../../models/Attendance');
const { protect, roles, audit } = require('../../middleware/auth');
const { validate, asyncHandler } = require('../../middleware/errorHandler');

// ── GET /attendance?classId=&sectionId=&date= ──────────────────────────────
router.get('/', protect, asyncHandler(async (req, res) => {
  const { classId, sectionId, date, month, year } = req.query;
  const filter = { schoolId: req.schoolId };

  if (classId)   filter.classId   = classId;
  if (sectionId) filter.sectionId = sectionId;

  if (date) {
    const d = new Date(date);
    filter.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
  } else if (month && year) {
    filter.date = {
      $gte: new Date(year, month - 1, 1),
      $lt:  new Date(year, month, 1),
    };
  }

  const records = await Attendance.find(filter)
    .populate('classId', 'name')
    .populate('sectionId', 'name')
    .populate('records.studentId', 'firstName lastName admissionNo rollNo')
    .sort({ date: -1 });

  res.json({ success: true, records });
}));

// ── POST /attendance — mark attendance for a class ─────────────────────────
router.post('/',
  protect,
  roles('school_admin','principal','teacher'),
  [
    body('classId').notEmpty().withMessage('classId required'),
    body('sectionId').notEmpty().withMessage('sectionId required'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('records').isArray({ min: 1 }).withMessage('Records array required'),
    body('records.*.studentId').notEmpty().withMessage('studentId required in each record'),
    body('records.*.status').isIn(['present','absent','late','leave','holiday']),
  ],
  validate,
  audit('CREATE', 'Attendance'),
  asyncHandler(async (req, res) => {
    const { classId, sectionId, date, records, period = 0, academicYearId } = req.body;

    const d = new Date(date);
    const dayStart = new Date(d.setHours(0,0,0,0));
    const dayEnd   = new Date(d.setHours(23,59,59,999));

    // Upsert attendance for the day
    const attendance = await Attendance.findOneAndUpdate(
      { schoolId: req.schoolId, classId, sectionId, date: { $gte: dayStart, $lte: dayEnd }, period },
      {
        $set: {
          schoolId: req.schoolId, classId, sectionId, academicYearId,
          date: new Date(date), period, records,
          markedById: req.user._id,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ success: true, attendance, message: 'Attendance saved' });
  })
);

// ── GET /attendance/report/monthly ────────────────────────────────────────
router.get('/report/monthly', protect, asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const pipeline = [
    { $match: { schoolId: req.schoolId, date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    { $group: {
      _id: { month: { $month: '$date' } },
      totalDays: { $sum: 1 },
      totalRecords: { $sum: { $size: '$records' } },
      presentCount: { $sum: { $size: { $filter: { input: '$records', cond: { $eq: ['$$this.status','present'] } } } } },
    }},
    { $sort: { '_id.month': 1 } },
  ];

  const data = await Attendance.aggregate(pipeline);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const result = data.map(d => ({
    month: months[d._id.month - 1],
    percentage: d.totalRecords ? Math.round(d.presentCount / d.totalRecords * 100) : 0,
  }));

  res.json({ success: true, data: result });
}));

// ── GET /attendance/student/:studentId ─────────────────────────────────────
router.get('/student/:studentId', protect, asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const filter = { schoolId: req.schoolId, 'records.studentId': req.params.studentId };
  if (month && year) {
    filter.date = { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) };
  }

  const records = await Attendance.find(filter).select('date records.$');

  const calendar = records.map(r => ({
    date:   r.date,
    status: r.records[0]?.status || 'unknown',
  }));

  const total   = calendar.length;
  const present = calendar.filter(c => c.status === 'present').length;
  const absent  = calendar.filter(c => c.status === 'absent').length;
  const late    = calendar.filter(c => c.status === 'late').length;

  res.json({ success: true, calendar, summary: { total, present, absent, late, percentage: total ? Math.round(present/total*100) : 0 } });
}));

module.exports = router;
