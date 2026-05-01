const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  code:       { type: String, required: true, unique: true, uppercase: true },
  board:      { type: String, required: true, enum: ['CBSE','ICSE','State Board','IB','IGCSE','Other'] },
  type:       { type: String, default: 'Co-educational', enum: ['Boys','Girls','Co-educational'] },
  address:    { street: String, city: String, state: String, pincode: String },
  phone:      String,
  email:      { type: String, lowercase: true },
  website:    String,
  logo:       String,
  established: Number,
  currentAcademicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
