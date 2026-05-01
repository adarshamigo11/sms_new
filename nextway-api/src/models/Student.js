const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  schoolId:      { type: mongoose.Schema.Types.ObjectId, ref: 'School',       required: true },
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
  academicYearId:{ type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  classId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  sectionId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },

  admissionNo:   { type: String, required: true },
  rollNo:        String,
  firstName:     { type: String, required: true, trim: true },
  lastName:      { type: String, required: true, trim: true },
  dateOfBirth:   Date,
  gender:        { type: String, enum: ['Male','Female','Other'] },
  bloodGroup:    { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'] },
  aadhaarNo:     String,
  photo:         String,

  address: {
    street: String, city: String,
    state: String, pincode: String,
  },
  phone:         String,  // parent contact
  email:         String,

  admissionDate: { type: Date, default: Date.now },
  status:        { type: String, enum: ['active','inactive','transferred','graduated'], default: 'active' },
  category:      { type: String, enum: ['General','OBC','SC','ST','EWS'], default: 'General' },

  transportRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute' },
  hostelRoomId:     { type: mongoose.Schema.Types.ObjectId, ref: 'HostelRoom' },
}, { timestamps: true, toJSON: { virtuals: true } });

studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.index({ schoolId: 1, admissionNo: 1 }, { unique: true });
studentSchema.index({ schoolId: 1, classId: 1, sectionId: 1 });

module.exports = mongoose.model('Student', studentSchema);
