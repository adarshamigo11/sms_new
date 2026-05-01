const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  schoolId:  { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name:      { type: String, required: true },   // "2025-26"
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  isCurrent: { type: Boolean, default: false },
}, { timestamps: true });

academicYearSchema.index({ schoolId: 1, isCurrent: 1 });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
