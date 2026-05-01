require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path       = require('path');

const connectDB       = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ── Route Modules ──────────────────────────────────────────────────────────
const authRoutes      = require('./modules/auth/auth.routes');
const studentRoutes   = require('./modules/students/students.routes');
const attendanceRoutes= require('./modules/attendance/attendance.routes');
const feesRoutes      = require('./modules/fees/fees.routes');
const academicRoutes  = require('./modules/classes/academic.routes');
const {
  homeworkRouter,
  examsRouter,
  leavesRouter,
  noticesRouter,
  libraryRouter,
  transportRouter,
  hostelRouter,
  inventoryRouter,
  auditRouter,
  aiRouter,
} = require('./modules/routes');

// ── App Setup ──────────────────────────────────────────────────────────────
const app = express();

// Connect DB
connectDB();

// ── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ── Rate Limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max:      Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message:  { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders:   false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  message:  { success: false, message: 'Too many login attempts, please wait 15 minutes' },
});

app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', limiter);

// ── Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Logging ────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Static Files (uploads) ─────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NEXTWAY API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────
const BASE = '/api/v1';

app.use(`${BASE}/auth`,        authRoutes);
app.use(`${BASE}/students`,    studentRoutes);
app.use(`${BASE}/attendance`,  attendanceRoutes);
app.use(`${BASE}/fees`,        feesRoutes);
app.use(`${BASE}/homework`,    homeworkRouter);
app.use(`${BASE}/exams`,       examsRouter);
app.use(`${BASE}/leaves`,      leavesRouter);
app.use(`${BASE}/notices`,     noticesRouter);
app.use(`${BASE}/library`,     libraryRouter);
app.use(`${BASE}/transport`,   transportRouter);
app.use(`${BASE}/hostel`,      hostelRouter);
app.use(`${BASE}/inventory`,   inventoryRouter);
app.use(`${BASE}/audit`,       auditRouter);
app.use(`${BASE}/ai`,          aiRouter);
app.use(`${BASE}`,             academicRoutes);  // /classes, /sections, /subjects, /users, /reports

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 NEXTWAY API running on port ${PORT}`);
  console.log(`📍 Environment : ${process.env.NODE_ENV}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 API base    : http://localhost:${PORT}/api/v1\n`);
});

module.exports = app;
