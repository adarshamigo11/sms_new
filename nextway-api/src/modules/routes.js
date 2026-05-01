// ── HOMEWORK ROUTES ─────────────────────────────────────────────────────────
const path = require('path');
const modelsPath = path.resolve(__dirname, '../models');
const middlewarePath = path.resolve(__dirname, '../middleware');

// ── HOMEWORK ROUTES ─────────────────────────────────────────────────────────
const homeworkRouter = require('express').Router();
const { body } = require('express-validator');
const { Homework } = require(path.join(modelsPath, 'Academic2'));
const { protect, roles } = require(path.join(middlewarePath, 'auth'));
const { validate, asyncHandler } = require(path.join(middlewarePath, 'errorHandler'));

homeworkRouter.get('/', protect, asyncHandler(async (req, res) => {
  const { classId, sectionId, subjectId, status } = req.query;
  const filter = { schoolId: req.schoolId };
  if (classId)   filter.classId   = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (subjectId) filter.subjectId = subjectId;
  if (status)    filter.status    = status;

  const homework = await Homework.find(filter)
    .populate('classId',   'name')
    .populate('sectionId', 'name')
    .populate('subjectId', 'name')
    .populate('assignedById', 'name')
    .sort({ dueDate: 1 });

  res.json({ success: true, homework });
}));

homeworkRouter.post('/',
  protect, roles('school_admin','principal','teacher'),
  [
    body('title').trim().notEmpty(),
    body('classId').notEmpty(),
    body('dueDate').isISO8601(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const hw = await Homework.create({ ...req.body, schoolId: req.schoolId, assignedById: req.user._id });
    res.status(201).json({ success: true, homework: hw });
  })
);

homeworkRouter.post('/:id/submit', protect, roles('student'), asyncHandler(async (req, res) => {
  const { studentId, content } = req.body;
  const hw = await Homework.findOneAndUpdate(
    { _id: req.params.id, schoolId: req.schoolId },
    { $push: { submissions: { studentId, content, submittedAt: new Date() } } },
    { new: true }
  );
  if (!hw) return res.status(404).json({ success: false, message: 'Homework not found' });
  res.json({ success: true, message: 'Submitted successfully' });
}));

homeworkRouter.put('/:id/grade', protect, roles('teacher','school_admin'), asyncHandler(async (req, res) => {
  const { studentId, marks, remarks } = req.body;
  await Homework.updateOne(
    { _id: req.params.id, 'submissions.studentId': studentId },
    { $set: { 'submissions.$.marks': marks, 'submissions.$.remarks': remarks, 'submissions.$.status': 'graded' } }
  );
  res.json({ success: true, message: 'Graded' });
}));

// ── EXAMS ROUTES ────────────────────────────────────────────────────────────
const examsRouter = require('express').Router();
const { Exam, ExamResult } = require(path.join(modelsPath, 'Academic2'));

examsRouter.get('/', protect, asyncHandler(async (req, res) => {
  const exams = await Exam.find({ schoolId: req.schoolId })
    .populate('classes', 'name')
    .sort({ startDate: -1 });
  res.json({ success: true, exams });
}));

examsRouter.post('/', protect, roles('school_admin','principal'),
  asyncHandler(async (req, res) => {
    const exam = await Exam.create({ ...req.body, schoolId: req.schoolId, createdById: req.user._id });
    res.status(201).json({ success: true, exam });
  })
);

examsRouter.get('/:examId/results', protect, asyncHandler(async (req, res) => {
  const results = await ExamResult.find({ schoolId: req.schoolId, examId: req.params.examId })
    .populate('studentId', 'firstName lastName admissionNo rollNo')
    .sort({ rank: 1 });
  res.json({ success: true, results });
}));

examsRouter.post('/:examId/results', protect, roles('teacher','school_admin'),
  asyncHandler(async (req, res) => {
    const { studentId, marks } = req.body;
    const totalObtained = marks.reduce((s, m) => s + (m.obtained || 0), 0);
    const totalMarks    = marks.reduce((s, m) => s + (m.maxMarks || 100), 0);
    const percentage    = totalMarks ? Math.round(totalObtained / totalMarks * 100) : 0;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'F';

    const result = await ExamResult.findOneAndUpdate(
      { schoolId: req.schoolId, examId: req.params.examId, studentId },
      { $set: { marks, totalMarks, totalObtained, percentage, grade, enteredById: req.user._id } },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, result });
  })
);

// ── LEAVES ROUTES ──────────────────────────────────────────────────────────
const leavesRouter = require('express').Router();
const { Leave } = require(path.join(modelsPath, 'Misc'));

leavesRouter.get('/', protect, asyncHandler(async (req, res) => {
  const { status, userId } = req.query;
  const filter = { schoolId: req.schoolId };
  if (status) filter.status = status;
  // Non-admins only see their own leaves
  if (!['school_admin','principal'].includes(req.user.role)) {
    filter.requestedById = req.user._id;
  } else if (userId) {
    filter.requestedById = userId;
  }

  const leaves = await Leave.find(filter)
    .populate('requestedById', 'name role')
    .populate('reviewedById', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, leaves });
}));

leavesRouter.post('/', protect,
  asyncHandler(async (req, res) => {
    const leave = await Leave.create({
      ...req.body,
      schoolId:      req.schoolId,
      requestedById: req.user._id,
    });
    res.status(201).json({ success: true, leave });
  })
);

leavesRouter.patch('/:id/review', protect, roles('school_admin','principal'),
  asyncHandler(async (req, res) => {
    const { status, reviewNote } = req.body;
    if (!['approved','rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }
    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      { status, reviewNote, reviewedById: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    res.json({ success: true, leave });
  })
);

// ── NOTICES ROUTES ─────────────────────────────────────────────────────────
const noticesRouter = require('express').Router();
const { Notice } = require(path.join(modelsPath, 'Misc'));

noticesRouter.get('/', protect, asyncHandler(async (req, res) => {
  const notices = await Notice.find({
    schoolId: req.schoolId,
    isPublished: true,
    $or: [
      { targetRoles: 'all' },
      { targetRoles: req.user.role },
      { targetRoles: { $size: 0 } },
    ],
  }).sort({ publishDate: -1 }).limit(20);
  res.json({ success: true, notices });
}));

noticesRouter.post('/', protect, roles('school_admin','principal'),
  asyncHandler(async (req, res) => {
    const notice = await Notice.create({ ...req.body, schoolId: req.schoolId, createdById: req.user._id });
    res.status(201).json({ success: true, notice });
  })
);

noticesRouter.put('/:id', protect, roles('school_admin','principal'), asyncHandler(async (req, res) => {
  const notice = await Notice.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true });
  if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
  res.json({ success: true, notice });
}));

noticesRouter.delete('/:id', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  await Notice.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, { isPublished: false });
  res.json({ success: true, message: 'Notice removed' });
}));

// ── LIBRARY ROUTES ─────────────────────────────────────────────────────────
const libraryRouter = require('express').Router();
const { Book, BookIssue } = require(path.join(modelsPath, 'Misc'));

libraryRouter.get('/books', protect, asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = { schoolId: req.schoolId, isActive: true };
  if (category) filter.category = category;
  if (search)   filter.$or = [{ title: { $regex: search, $options: 'i' } }, { author: { $regex: search, $options: 'i' } }];
  const books = await Book.find(filter).sort({ title: 1 });
  res.json({ success: true, books });
}));

libraryRouter.post('/books', protect, roles('school_admin','librarian'), asyncHandler(async (req, res) => {
  const book = await Book.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, book });
}));

libraryRouter.post('/issues', protect, roles('school_admin','librarian'), asyncHandler(async (req, res) => {
  const { bookId, issuedToId, dueDate } = req.body;
  const book = await Book.findById(bookId);
  if (!book || book.availableCopies < 1) {
    return res.status(400).json({ success: false, message: 'No copies available' });
  }
  const issue = await BookIssue.create({ schoolId: req.schoolId, bookId, issuedToId, issuedById: req.user._id, dueDate: new Date(dueDate) });
  await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });
  res.status(201).json({ success: true, issue });
}));

libraryRouter.patch('/issues/:id/return', protect, roles('school_admin','librarian'), asyncHandler(async (req, res) => {
  const issue = await BookIssue.findOneAndUpdate(
    { _id: req.params.id, schoolId: req.schoolId, status: 'issued' },
    { status: 'returned', returnDate: new Date() }, { new: true }
  );
  if (!issue) return res.status(404).json({ success: false, message: 'Issue record not found' });
  await Book.findByIdAndUpdate(issue.bookId, { $inc: { availableCopies: 1 } });
  res.json({ success: true, message: 'Book returned' });
}));

// ── TRANSPORT ROUTES ───────────────────────────────────────────────────────
const transportRouter = require('express').Router();
const { TransportRoute } = require(path.join(modelsPath, 'Misc'));

transportRouter.get('/', protect, asyncHandler(async (req, res) => {
  const routes = await TransportRoute.find({ schoolId: req.schoolId, isActive: true });
  res.json({ success: true, routes });
}));

transportRouter.post('/', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  const route = await TransportRoute.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, route });
}));

// ── HOSTEL ROUTES ──────────────────────────────────────────────────────────
const hostelRouter = require('express').Router();
const { HostelRoom } = require(path.join(modelsPath, 'Misc'));

hostelRouter.get('/rooms', protect, asyncHandler(async (req, res) => {
  const rooms = await HostelRoom.find({ schoolId: req.schoolId, isActive: true })
    .populate('occupants', 'firstName lastName admissionNo');
  res.json({ success: true, rooms });
}));

hostelRouter.post('/rooms', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  const room = await HostelRoom.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, room });
}));

hostelRouter.patch('/rooms/:id/assign', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const room = await HostelRoom.findById(req.params.id);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  if (room.occupants.length >= room.capacity) {
    return res.status(400).json({ success: false, message: 'Room is full' });
  }
  await HostelRoom.findByIdAndUpdate(req.params.id, { $addToSet: { occupants: studentId } });
  res.json({ success: true, message: 'Student assigned to room' });
}));

// ── INVENTORY ROUTES ────────────────────────────────────────────────────────
const inventoryRouter = require('express').Router();
const { Inventory } = require(path.join(modelsPath, 'Misc'));

inventoryRouter.get('/', protect, asyncHandler(async (req, res) => {
  const items = await Inventory.find({ schoolId: req.schoolId, isActive: true }).sort({ name: 1 });
  res.json({ success: true, items });
}));

inventoryRouter.post('/', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  const item = await Inventory.create({ ...req.body, schoolId: req.schoolId });
  res.status(201).json({ success: true, item });
}));

inventoryRouter.put('/:id', protect, roles('school_admin'), asyncHandler(async (req, res) => {
  const item = await Inventory.findOneAndUpdate({ _id: req.params.id, schoolId: req.schoolId }, req.body, { new: true });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, item });
}));

// ── AUDIT LOG ROUTES ───────────────────────────────────────────────────────
const auditRouter = require('express').Router();
const { AuditLog } = require(path.join(modelsPath, 'Misc'));

auditRouter.get('/', protect, roles('school_admin','principal'), asyncHandler(async (req, res) => {
  const { action, userId, page = 1, limit = 50 } = req.query;
  const filter = { schoolId: req.schoolId };
  if (action) filter.action = action;
  if (userId) filter.userId = userId;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);
  res.json({ success: true, logs, total });
}));

// ── AI DOUBT SOLVER ────────────────────────────────────────────────────────
const aiRouter = require('express').Router();
const { protect: aiProtect, roles: aiRoles } = require(path.join(middlewarePath, 'auth'));
const { asyncHandler: aiAsync } = require(path.join(middlewarePath, 'errorHandler'));

aiRouter.post('/doubt', aiProtect, aiRoles('student','parent'), aiAsync(async (req, res) => {
  const { question, subject, className, history = [] } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }

  const provider = process.env.AI_PROVIDER || 'claude';
  const systemPrompt = `You are a helpful academic tutor for a ${className || 'school'} student studying ${subject || 'general subjects'}. 
Give clear, step-by-step explanations suitable for a school student. Use simple language, examples, and structured answers. 
If the question involves math, show each step clearly. Keep answers educational and focused.`;

  try {
    let answer = '';

    if (provider === 'claude') {
      const Anthropic = require('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const messages = [
        ...history.slice(-4).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: question },
      ];

      // SSE streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await client.messages.stream({
        model:      'claude-sonnet-4-5',
        max_tokens: 1024,
        system:     systemPrompt,
        messages,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          answer += chunk.delta.text;
          res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ done: true, answer })}\n\n`);
      res.end();
      return;
    }

    if (provider === 'openai') {
      const OpenAI = require('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4),
        { role: 'user', content: question },
      ];

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await client.chat.completions.create({ model: 'gpt-4o-mini', messages, stream: true });
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          answer += text;
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ done: true, answer })}\n\n`);
      res.end();
      return;
    }

    if (provider === 'gemini') {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(question);
      answer = result.response.text();
      res.json({ success: true, answer });
      return;
    }

    res.status(400).json({ success: false, message: `Unknown AI provider: ${provider}` });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ success: false, message: 'AI service unavailable. Please try again.' });
  }
}));

module.exports = { homeworkRouter, examsRouter, leavesRouter, noticesRouter, libraryRouter, transportRouter, hostelRouter, inventoryRouter, auditRouter, aiRouter };
