const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { AuditLog } = require('../models/Misc');

// ── Verify Access Token ────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password -refreshTokens');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated' });
    }

    req.user     = user;
    req.schoolId = user.schoolId;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
};

// ── Role Guard ─────────────────────────────────────────────────────────────
const roles = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
    });
  }
  next();
};

// ── School isolation guard ─────────────────────────────────────────────────
// Ensures query param / body schoolId matches logged-in user's school
const sameSchool = (req, res, next) => {
  const bodySchool  = req.body?.schoolId?.toString();
  const paramSchool = req.params?.schoolId?.toString();
  const userSchool  = req.user.schoolId.toString();

  if (bodySchool  && bodySchool  !== userSchool) {
    return res.status(403).json({ success: false, message: 'Cross-school access denied' });
  }
  if (paramSchool && paramSchool !== userSchool && req.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Cross-school access denied' });
  }
  next();
};

// ── Audit Logger ───────────────────────────────────────────────────────────
const audit = (action, entity) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400) {
      try {
        await AuditLog.create({
          schoolId:  req.user?.schoolId,
          userId:    req.user?._id,
          userName:  req.user?.name,
          action,
          entity,
          entityId:  req.params?.id || res.locals?.entityId,
          detail:    res.locals?.auditDetail || `${action} ${entity}`,
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent']?.substring(0, 100),
        });
      } catch (_) { /* audit failures should never break requests */ }
    }
  });
  next();
};

module.exports = { protect, roles, sameSchool, audit };
