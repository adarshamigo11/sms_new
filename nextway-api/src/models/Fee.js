const mongoose = require('mongoose');

// ── FEE STRUCTURE ──────────────────────────────────────────────────────────
const feeStructureSchema = new mongoose.Schema({
  schoolId:       { type: mongoose.Schema.Types.ObjectId, ref: 'School',       required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  classId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },  // null = all classes
  name:           { type: String, required: true },   // "Q1 2026 Fee"
  heads: [{
    name:     { type: String, required: true },  // "Tuition Fee"
    amount:   { type: Number, required: true },
    isOptional: { type: Boolean, default: false },
  }],
  dueDate:        Date,
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });

// ── FEE INVOICE ────────────────────────────────────────────────────────────
const feeInvoiceSchema = new mongoose.Schema({
  schoolId:         { type: mongoose.Schema.Types.ObjectId, ref: 'School',       required: true },
  academicYearId:   { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  studentId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Student',      required: true },
  feeStructureId:   { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' },
  invoiceNo:        { type: String, required: true },

  heads: [{
    name:      String,
    amount:    Number,
    discount:  { type: Number, default: 0 },
    finalAmount: Number,
  }],
  totalAmount:      { type: Number, required: true },
  totalPaid:        { type: Number, default: 0 },
  balance:          { type: Number, default: 0 },
  dueDate:          Date,
  status:           { type: String, enum: ['pending','partial','paid','overdue','waived'], default: 'pending' },
}, { timestamps: true });

feeInvoiceSchema.index({ schoolId: 1, studentId: 1 });
feeInvoiceSchema.index({ schoolId: 1, invoiceNo: 1 }, { unique: true });

// ── FEE PAYMENT ────────────────────────────────────────────────────────────
const feePaymentSchema = new mongoose.Schema({
  schoolId:    { type: mongoose.Schema.Types.ObjectId, ref: 'School',     required: true },
  invoiceId:   { type: mongoose.Schema.Types.ObjectId, ref: 'FeeInvoice', required: true },
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student',    required: true },
  receiptNo:   { type: String, required: true },
  amount:      { type: Number, required: true },
  method:      { type: String, enum: ['Cash','UPI','Bank Transfer','Cheque','Card','Online'], required: true },
  transactionId: String,
  collectedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks:     String,
  paymentDate: { type: Date, default: Date.now },
}, { timestamps: true });

feePaymentSchema.index({ schoolId: 1, receiptNo: 1 }, { unique: true });

module.exports = {
  FeeStructure: mongoose.model('FeeStructure', feeStructureSchema),
  FeeInvoice:   mongoose.model('FeeInvoice',   feeInvoiceSchema),
  FeePayment:   mongoose.model('FeePayment',   feePaymentSchema),
};
