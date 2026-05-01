const mongoose = require('mongoose');

// ── HOMEWORK ───────────────────────────────────────────────────────────────
const homeworkSchema = new mongoose.Schema({
  schoolId:       { type: mongoose.Schema.Types.ObjectId, ref: 'School',    required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  classId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Class',     required: true },
  sectionId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  subjectId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  assignedById:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',      required: true },

  title:          { type: String, required: true, trim: true },
  description:    String,
  dueDate:        { type: Date, required: true },
  attachments:    [String],
  maxMarks:       { type: Number, default: 0 },
  isGraded:       { type: Boolean, default: false },
  status:         { type: String, enum: ['active','closed','cancelled'], default: 'active' },

  submissions: [{
    studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    content:    String,
    files:      [String],
    submittedAt:{ type: Date, default: Date.now },
    marks:      Number,
    remarks:    String,
    status:     { type: String, enum: ['submitted','graded','late'], default: 'submitted' },
  }],
}, { timestamps: true });

homeworkSchema.index({ schoolId: 1, classId: 1, dueDate: -1 });

// ── EXAM ───────────────────────────────────────────────────────────────────
const examSchema = new mongoose.Schema({
  schoolId:       { type: mongoose.Schema.Types.ObjectId, ref: 'School',       required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  name:           { type: String, required: true, trim: true },
  type:           { type: String, enum: ['Unit Test','Mid Term','Final','Pre-Board','Other'], required: true },
  startDate:      { type: Date, required: true },
  endDate:        { type: Date, required: true },
  classes:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  status:         { type: String, enum: ['upcoming','ongoing','completed','results_published'], default: 'upcoming' },
  createdById:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  schedule: [{
    classId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    date:      Date,
    startTime: String,
    endTime:   String,
    room:      String,
    maxMarks:  { type: Number, default: 100 },
    passMark:  { type: Number, default: 33 },
  }],
}, { timestamps: true });

// ── EXAM RESULT ────────────────────────────────────────────────────────────
const examResultSchema = new mongoose.Schema({
  schoolId:    { type: mongoose.Schema.Types.ObjectId, ref: 'School',   required: true },
  examId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Exam',     required: true },
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student',  required: true },
  classId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  enteredById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  marks: [{
    subjectId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subjectName:  String,
    maxMarks:     Number,
    obtained:     Number,
    grade:        String,
    isAbsent:     { type: Boolean, default: false },
    remarks:      String,
  }],
  totalMarks:   Number,
  totalObtained:Number,
  percentage:   Number,
  grade:        String,
  rank:         Number,
  isPublished:  { type: Boolean, default: false },
}, { timestamps: true });

examResultSchema.index({ schoolId: 1, examId: 1, studentId: 1 }, { unique: true });

module.exports = {
  Homework:   mongoose.model('Homework',   homeworkSchema),
  Exam:       mongoose.model('Exam',       examSchema),
  ExamResult: mongoose.model('ExamResult', examResultSchema),
};
