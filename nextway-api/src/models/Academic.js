const mongoose = require('mongoose');

// ── CLASS ──────────────────────────────────────────────────────────────────
const classSchema = new mongoose.Schema({
  schoolId:   { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name:       { type: String, required: true, trim: true },  // "Class 8"
  numericName:{ type: Number },                               // 8
  orderIndex: { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

classSchema.index({ schoolId: 1, name: 1 }, { unique: true });

// ── SECTION ────────────────────────────────────────────────────────────────
const sectionSchema = new mongoose.Schema({
  schoolId:       { type: mongoose.Schema.Types.ObjectId, ref: 'School',       required: true },
  classId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Class',        required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  name:           { type: String, required: true, trim: true },  // "A"
  classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room:           String,
  maxStrength:    { type: Number, default: 50 },
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });

sectionSchema.index({ schoolId: 1, classId: 1, academicYearId: 1, name: 1 }, { unique: true });

// ── SUBJECT ────────────────────────────────────────────────────────────────
const subjectSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name:     { type: String, required: true, trim: true },
  code:     { type: String, trim: true, uppercase: true },
  type:     { type: String, enum: ['Theory','Practical','Both'], default: 'Theory' },
  isElective:{ type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

subjectSchema.index({ schoolId: 1, code: 1 }, { unique: true, sparse: true });

module.exports = {
  Class:   mongoose.model('Class',   classSchema),
  Section: mongoose.model('Section', sectionSchema),
  Subject: mongoose.model('Subject', subjectSchema),
};
