const router = require('express').Router();
const { body } = require('express-validator');
const { FeeInvoice, FeePayment, FeeStructure } = require('../../models/Fee');
const { protect, roles, audit } = require('../../middleware/auth');
const { validate, asyncHandler } = require('../../middleware/errorHandler');
const { generateReceiptNo, generateInvoiceNo } = require('../../utils/jwt');

// ── GET /fees/invoices ──────────────────────────────────────────────────────
router.get('/invoices', protect, asyncHandler(async (req, res) => {
  const { studentId, status, classId, page = 1, limit = 50, search } = req.query;
  const filter = { schoolId: req.schoolId };

  if (studentId) filter.studentId = studentId;
  if (status)    filter.status    = status;

  let invoices = await FeeInvoice.find(filter)
    .populate({ path:'studentId', select:'firstName lastName admissionNo classId sectionId', populate:[{path:'classId',select:'name'},{path:'sectionId',select:'name'}] })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page)-1)*Number(limit));

  if (search) {
    invoices = invoices.filter(inv =>
      `${inv.studentId?.firstName} ${inv.studentId?.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = await FeeInvoice.countDocuments(filter);
  const totalCollected = await FeeInvoice.aggregate([
    { $match: filter },
    { $group: { _id: null, total: { $sum: '$totalPaid' }, pending: { $sum: '$balance' } } },
  ]);

  res.json({ success: true, invoices, total, stats: totalCollected[0] || { total: 0, pending: 0 } });
}));

// ── GET /fees/invoices/:id ──────────────────────────────────────────────────
router.get('/invoices/:id', protect, asyncHandler(async (req, res) => {
  const invoice = await FeeInvoice.findOne({ _id: req.params.id, schoolId: req.schoolId })
    .populate('studentId', 'firstName lastName admissionNo');

  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

  const payments = await FeePayment.find({ invoiceId: invoice._id }).sort({ createdAt: -1 });
  res.json({ success: true, invoice, payments });
}));

// ── POST /fees/invoices/generate ────────────────────────────────────────────
router.post('/invoices/generate',
  protect,
  roles('school_admin','accountant'),
  [
    body('classId').optional(),
    body('dueDate').isISO8601().withMessage('Valid due date required'),
    body('heads').isArray({ min: 1 }).withMessage('At least one fee head required'),
    body('academicYearId').notEmpty(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { classId, sectionId, dueDate, heads, academicYearId } = req.body;
    const Student = require('../../models/Student');

    const studentFilter = { schoolId: req.schoolId, status: 'active' };
    if (classId)   studentFilter.classId   = classId;
    if (sectionId) studentFilter.sectionId = sectionId;

    const students = await Student.find(studentFilter);

    const count = await FeeInvoice.countDocuments({ schoolId: req.schoolId });
    const totalAmount = heads.reduce((s, h) => s + h.amount, 0);

    const invoices = students.map((st, i) => ({
      schoolId:       req.schoolId,
      academicYearId,
      studentId:      st._id,
      invoiceNo:      generateInvoiceNo('NWA', count + i + 1),
      heads:          heads.map(h => ({ ...h, discount: 0, finalAmount: h.amount })),
      totalAmount,
      totalPaid:      0,
      balance:        totalAmount,
      dueDate:        new Date(dueDate),
      status:         'pending',
    }));

    await FeeInvoice.insertMany(invoices);
    res.status(201).json({ success: true, message: `${invoices.length} invoices generated`, count: invoices.length });
  })
);

// ── POST /fees/payments ─────────────────────────────────────────────────────
router.post('/payments',
  protect,
  roles('school_admin','accountant'),
  [
    body('invoiceId').notEmpty().withMessage('Invoice ID required'),
    body('amount').isNumeric({ min: 1 }).withMessage('Valid amount required'),
    body('method').isIn(['Cash','UPI','Bank Transfer','Cheque','Card','Online']),
  ],
  validate,
  audit('CREATE', 'FeePayment'),
  asyncHandler(async (req, res) => {
    const { invoiceId, amount, method, transactionId, remarks } = req.body;

    const invoice = await FeeInvoice.findOne({ _id: invoiceId, schoolId: req.schoolId });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    if (amount > invoice.balance) {
      return res.status(400).json({ success: false, message: `Amount exceeds balance of ₹${invoice.balance}` });
    }

    const count     = await FeePayment.countDocuments({ schoolId: req.schoolId });
    const receiptNo = generateReceiptNo('NWA', count + 1);

    const payment = await FeePayment.create({
      schoolId:      req.schoolId,
      invoiceId,
      studentId:     invoice.studentId,
      receiptNo,
      amount,
      method,
      transactionId,
      remarks,
      collectedById: req.user._id,
      paymentDate:   new Date(),
    });

    // Update invoice
    invoice.totalPaid += amount;
    invoice.balance   -= amount;
    invoice.status     = invoice.balance <= 0 ? 'paid' : invoice.totalPaid > 0 ? 'partial' : invoice.status;
    await invoice.save();

    res.status(201).json({ success: true, payment, invoice, message: `Payment of ₹${amount} recorded` });
  })
);

// ── GET /fees/collection/monthly ────────────────────────────────────────────
router.get('/collection/monthly', protect, asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const data = await FeePayment.aggregate([
    { $match: { schoolId: req.schoolId, paymentDate: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    { $group: { _id: { month: { $month: '$paymentDate' } }, collected: { $sum: '$amount' } } },
    { $sort: { '_id.month': 1 } },
  ]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const result = data.map(d => ({ month: months[d._id.month-1], collected: d.collected, pending: 0 }));
  res.json({ success: true, data: result });
}));

module.exports = router;
