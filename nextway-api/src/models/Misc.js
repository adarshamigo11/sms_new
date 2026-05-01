const mongoose = require('mongoose');

// ── LEAVE REQUEST ──────────────────────────────────────────────────────────
const leaveSchema = new mongoose.Schema({
  schoolId:     { type: mongoose.Schema.Types.ObjectId, ref: 'School',   required: true },
  requestedById:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
  type:         { type: String, required: true },
  fromDate:     { type: Date, required: true },
  toDate:       { type: Date, required: true },
  days:         { type: Number, required: true },
  reason:       { type: String, required: true },
  status:       { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  reviewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNote:   String,
  reviewedAt:   Date,
}, { timestamps: true });

leaveSchema.index({ schoolId: 1, requestedById: 1 });

// ── TRANSPORT ROUTE ────────────────────────────────────────────────────────
const transportRouteSchema = new mongoose.Schema({
  schoolId:    { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name:        { type: String, required: true },
  vehicleNo:   String,
  driverName:  String,
  driverPhone: String,
  shift:       { type: String, enum: ['Morning','Afternoon','Both'], default: 'Both' },
  stops:       [{ name: String, time: String, order: Number }],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// ── HOSTEL ROOM ────────────────────────────────────────────────────────────
const hostelRoomSchema = new mongoose.Schema({
  schoolId:  { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  roomNo:    { type: String, required: true },
  building:  String,
  floor:     String,
  type:      { type: String, enum: ['Single','Double','Triple','Dormitory'] },
  capacity:  { type: Number, required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  facilities:{ ac: Boolean, attached_bath: Boolean, wifi: Boolean },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true } });

hostelRoomSchema.virtual('occupied').get(function() { return this.occupants?.length || 0; });
hostelRoomSchema.virtual('status').get(function() {
  return this.occupants?.length >= this.capacity ? 'full' : 'available';
});

// ── LIBRARY BOOK ───────────────────────────────────────────────────────────
const bookSchema = new mongoose.Schema({
  schoolId:      { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  title:         { type: String, required: true, trim: true },
  author:        String,
  isbn:          String,
  publisher:     String,
  edition:       String,
  category:      { type: String, enum: ['Textbook','Reference','Fiction','Non-Fiction','Biography','Science','History','Other'] },
  totalCopies:   { type: Number, default: 1 },
  availableCopies:{ type: Number, default: 1 },
  rack:          String,
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

bookSchema.index({ schoolId: 1, isbn: 1 }, { sparse: true });

const bookIssueSchema = new mongoose.Schema({
  schoolId:    { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  bookId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Book',   required: true },
  issuedToId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  issuedById:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issueDate:   { type: Date, default: Date.now },
  dueDate:     { type: Date, required: true },
  returnDate:  Date,
  status:      { type: String, enum: ['issued','returned','overdue'], default: 'issued' },
  fine:        { type: Number, default: 0 },
}, { timestamps: true });

// ── INVENTORY ──────────────────────────────────────────────────────────────
const inventorySchema = new mongoose.Schema({
  schoolId:     { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name:         { type: String, required: true },
  category:     String,
  quantity:     { type: Number, default: 0 },
  unitPrice:    { type: Number, default: 0 },
  vendor:       String,
  purchaseDate: Date,
  location:     String,
  condition:    { type: String, enum: ['New','Good','Fair','Poor'], default: 'Good' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

// ── NOTICE / EVENT ─────────────────────────────────────────────────────────
const noticeSchema = new mongoose.Schema({
  schoolId:    { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  title:       { type: String, required: true },
  content:     { type: String, required: true },
  type:        { type: String, enum: ['Notice','Event','Holiday','Exam','Other'], default: 'Notice' },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
  targetRoles: [{ type: String }],  // ['all'] or specific roles
  publishDate: { type: Date, default: Date.now },
  expiryDate:  Date,
  attachments: [String],
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

noticeSchema.index({ schoolId: 1, isPublished: 1, publishDate: -1 });

// ── AUDIT LOG ──────────────────────────────────────────────────────────────
const auditLogSchema = new mongoose.Schema({
  schoolId:  { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:  String,
  action:    { type: String, enum: ['CREATE','UPDATE','DELETE','LOGIN','LOGOUT','EXPORT','VIEW'], required: true },
  entity:    String,
  entityId:  String,
  detail:    String,
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

auditLogSchema.index({ schoolId: 1, createdAt: -1 });

module.exports = {
  Leave:        mongoose.model('Leave',        leaveSchema),
  TransportRoute: mongoose.model('TransportRoute', transportRouteSchema),
  HostelRoom:   mongoose.model('HostelRoom',   hostelRoomSchema),
  Book:         mongoose.model('Book',         bookSchema),
  BookIssue:    mongoose.model('BookIssue',    bookIssueSchema),
  Inventory:    mongoose.model('Inventory',    inventorySchema),
  Notice:       mongoose.model('Notice',       noticeSchema),
  AuditLog:     mongoose.model('AuditLog',     auditLogSchema),
};
