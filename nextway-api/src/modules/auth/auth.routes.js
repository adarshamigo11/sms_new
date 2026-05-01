const router  = require('express').Router();
const { body } = require('express-validator');
const User    = require('../../models/User');
const { sendTokens, verifyRefreshToken, generateAccessToken } = require('../../utils/jwt');
const { protect } = require('../../middleware/auth');
const { validate, asyncHandler } = require('../../middleware/errorHandler');
const { AuditLog } = require('../../models/Misc');

// ── POST /auth/login ───────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();

    // Store refresh token (keep latest 5)
    const refreshToken = sendTokens(res, user);
    user.refreshTokens = [
      { token: refreshToken },
      ...(user.refreshTokens || []).slice(0, 4),
    ];
    await user.save({ validateBeforeSave: false });

    // Audit
    await AuditLog.create({
      schoolId: user.schoolId, userId: user._id, userName: user.name,
      action: 'LOGIN', entity: 'User', entityId: user._id.toString(),
      detail: 'Successful login', ipAddress: req.ip,
    }).catch(() => {});
  })
);

// ── POST /auth/refresh ─────────────────────────────────────────────────────
router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'Refresh token required' });

  const decoded = verifyRefreshToken(token);
  const user    = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  // Validate token is in stored list
  const isValid = user.refreshTokens?.some(rt => rt.token === token);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Refresh token revoked' });
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken });
}));

// ── POST /auth/logout ──────────────────────────────────────────────────────
router.post('/logout', protect, asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  // Remove this specific refresh token
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { refreshTokens: { token } },
  });

  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
}));

// ── POST /auth/change-password ─────────────────────────────────────────────
router.post('/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password          = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  })
);

// ── GET /auth/me ───────────────────────────────────────────────────────────
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject?.() || req.user });
}));

module.exports = router;
