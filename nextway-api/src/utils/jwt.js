const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '15m' });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' });

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7d
};

const sendTokens = (res, user, statusCode = 200) => {
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id:       user._id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      avatar:   user.avatar || user.name?.charAt(0).toUpperCase(),
      schoolId: user.schoolId,
      mustChangePassword: user.mustChangePassword,
    },
  });

  return refreshToken;
};

// Auto-generate sequential codes
const generateAdmissionNo = (schoolCode, year, sequence) =>
  `${schoolCode}/${year}/${String(sequence).padStart(4,'0')}`;

const generateReceiptNo = (schoolCode, sequence) =>
  `RCP-${new Date().getFullYear()}-${String(sequence).padStart(4,'0')}`;

const generateInvoiceNo = (schoolCode, sequence) =>
  `INV-${new Date().getFullYear()}-${String(sequence).padStart(5,'0')}`;

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendTokens,
  generateAdmissionNo,
  generateReceiptNo,
  generateInvoiceNo,
};
