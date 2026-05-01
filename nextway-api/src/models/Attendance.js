const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  schoolId:       { type: mongoose.Schema.Types.ObjectId, ref: 'School',       required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  classId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Class',        required: true },
  sectionId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Section',      required: true },
  date:           { type: Date, required: true },
  markedById:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  period:         { type: Number, default: 0 },  // 0 = daily, 1-8 = period-wise

  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status:    { type: String, enum: ['present','absent','late','leave','holiday'], required: true },
    remarks:   String,
  }],

  isLocked:   { type: Boolean, default: false },  // locked after 24h
}, { timestamps: true });

attendanceSchema.index({ schoolId: 1, classId: 1, sectionId: 1, date: 1, period: 1 }, { unique: true });
attendanceSchema.index({ 'records.studentId': 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
