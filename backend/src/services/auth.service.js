const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const registerUserService = async (userData, deviceInfo = { device: "Unknown", location: "Unknown" }) => {
  const { name, email, password } = userData;

  // Validate duplicate emails
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("Email is already registered");
    error.code = 11000;
    throw error;
  }

  // Create user with forced 'user' role for security
  const user = await User.create({ 
    name, 
    email, 
    password, 
    role: 'user',
    sessionsList: [{ device: deviceInfo.device, location: deviceInfo.location, time: new Date() }] 
  });
  const token = user.generateAccessToken();
  return { data: user, token };
};

const loginUserService = async (credentials, deviceInfo = { device: "Unknown", location: "Unknown" }) => {
  const { email, password } = credentials;

  // Use +password to explicitly select the hidden password field for verification
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Update login stats
  const now = new Date();
  if (!user.stats) {
    user.stats = { apiCallsToday: 0, activeSessions: 0, loginStreak: 0, securityScore: 85 };
  }
  
  if (user.stats.lastLoginDate) {
    const lastLogin = new Date(user.stats.lastLoginDate);
    const diffTime = Math.abs(now.setHours(0,0,0,0) - lastLogin.setHours(0,0,0,0));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      user.stats.loginStreak += 1;
    } else if (diffDays > 1) {
      user.stats.loginStreak = 1;
    }
  } else {
    user.stats.loginStreak = 1;
  }
  user.stats.lastLoginDate = new Date();
  user.stats.activeSessions = (user.stats.activeSessions || 0) + 1;

  if (!user.sessionsList) user.sessionsList = [];
  if (user.sessionsList.length >= 5) {
    user.sessionsList.shift();
  }
  user.sessionsList.push({ device: deviceInfo.device, location: deviceInfo.location, time: new Date() });
  
  await user.save();

  const token = user.generateAccessToken();
  user.password = undefined; // Scrub password from response

  return { data: user, token };
};

const logoutUserService = async (userId) => {
  // In a production app with redis, you would blacklist the token here
  const user = await User.findById(userId);
  if (user && user.stats) {
    user.stats.activeSessions = Math.max((user.stats.activeSessions || 1) - 1, 0);
    await user.save();
  }
  return true;
};

const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  
  // Create simple 6-char token for MVP
  const resetToken = crypto.randomBytes(3).toString("hex").toUpperCase();
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // In production, send via email. For MVP, we log it so we can see it.
  console.log(`\n\n=== PASSWORD RESET ===`);
  console.log(`Email: ${user.email}`);
  console.log(`Token: ${resetToken}`);
  console.log(`======================\n\n`);

  return { mockToken: resetToken };
};

const resetPasswordService = async (token, newPassword) => {
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return true;
};

const refreshTokenService = async (oldToken) => {
  if (!oldToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(
      oldToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch {
    const error = new Error("Invalid or expired refresh token. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const error = new Error("User belonging to this token no longer exists");
    error.statusCode = 401;
    throw error;
  }

  const token = user.generateAccessToken();
  return { token };
};

const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const sendOTPService = async (_email) => {
  return true;
};

const verifyOTPService = async (_email, _otp) => {
  return true;
};

const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!(await user.comparePassword(oldPassword))) {
    const error = new Error("Incorrect old password");
    error.statusCode = 401;
    throw error;
  }
  user.password = newPassword; // Will be safely hashed by the pre-save hook in the model
  if (user.stats) {
    user.stats.securityScore = Math.min((user.stats.securityScore || 85) + 5, 100);
  }
  await user.save();
  return true;
};

const updatePreferencesService = async (userId, preferences) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (preferences.notifs) {
    user.preferences.notifs = { ...user.preferences.notifs, ...preferences.notifs };
  }
  if (preferences.aiPrefs) {
    user.preferences.aiPrefs = { ...user.preferences.aiPrefs, ...preferences.aiPrefs };
  }
  if (preferences.appearancePrefs) {
    if (preferences.appearancePrefs.themeMode) {
      user.preferences.appearancePrefs.themeMode = preferences.appearancePrefs.themeMode;
    }
    if (preferences.appearancePrefs.appearance) {
      user.preferences.appearancePrefs.appearance = { ...user.preferences.appearancePrefs.appearance, ...preferences.appearancePrefs.appearance };
    }
  }

  await user.save();
  return user.preferences;
};

const updateProfileService = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (profileData.name) user.name = profileData.name;
  if (profileData.email) user.email = profileData.email;
  if (profileData.company !== undefined) user.company = profileData.company;
  if (profileData.role && user.role === 'admin') user.role = profileData.role; // only admin can change role maybe? Or we just accept it for MVP
  if (profileData.avatar) user.avatar = profileData.avatar;

  await user.save();
  return user;
};

const exportDataService = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");
  
  // Create a mock dataset for export
  const exportData = {
    profile: user,
    analytics: {
      totalLogins: user.stats?.loginStreak || 0,
      apiCalls: user.stats?.apiCallsToday || 0,
      history: ["Login at " + new Date().toISOString(), "Updated preferences"],
    },
    exportedAt: new Date().toISOString(),
  };
  return exportData;
};

const createBackupService = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  const backupData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    config: user.preferences,
    hash: "sha256-mock-hash-of-encrypted-backup-string",
  };
  return backupData;
};

const deactivateAccountService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  
  user.isActive = false;
  await user.save();
  return { message: "Account deactivated successfully" };
};

const deleteAccountService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("User not found");
  return { message: "Account permanently deleted" };
};

const revokeSessionService = async (userId, sessionId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  
  user.sessionsList = user.sessionsList.filter(s => s._id.toString() !== sessionId.toString());
  user.stats.activeSessions = user.sessionsList.length;
  await user.save();
  return user.sessionsList;
};

module.exports = {
  registerUser: registerUserService,
  loginUser: loginUserService,
  logoutUser: logoutUserService,
  forgotPassword: forgotPasswordService,
  resetPassword: resetPasswordService,
  refreshToken: refreshTokenService,
  getCurrentUser: getCurrentUserService,
  sendOTP: sendOTPService,
  verifyOTP: verifyOTPService,
  changePassword: changePasswordService,
  updatePreferences: updatePreferencesService,
  updateProfile: updateProfileService,
  exportData: exportDataService,
  createBackup: createBackupService,
  deactivateAccount: deactivateAccountService,
  deleteAccount: deleteAccountService,
  revokeSession: revokeSessionService,
};
