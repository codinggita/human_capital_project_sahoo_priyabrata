const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseFormatter");
const authService = require("../services/auth.service");

// Extract simple device info
const getDeviceInfo = (req) => {
  const ua = req.headers["user-agent"] || "Unknown Device";
  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  
  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("iPhone")) os = "iPhone";
  else if (ua.includes("Android")) os = "Android";

  return {
    device: `${browser} · ${os}`,
    location: req.ip === "::1" || req.ip === "127.0.0.1" ? "Localhost" : req.ip,
  };
};

// Call service layer for user registration
const register = asyncHandler(async (req, res) => {
  const deviceInfo = getDeviceInfo(req);
  const { data, token } = await authService.registerUser(req.body, deviceInfo);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  const io = req.app.get("io");
  if (io) {
    console.log("Emitting NEW_USER_REGISTERED to admin_room for user:", data.email);
    io.to("admin_room").emit("NEW_USER_REGISTERED", {
      _id: data._id,
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
    });
  } else {
    console.log("Socket.io instance not found in req.app");
  }

  return successResponse(res, 201, "User registered successfully", {
    user: data,
    token,
  });
});

// Call service layer for user login
const login = asyncHandler(async (req, res) => {
  const deviceInfo = getDeviceInfo(req);
  const { data, token } = await authService.loginUser(req.body, deviceInfo);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  return successResponse(res, 200, "User logged in successfully", {
    user: data,
    token,
  });
});

// Provide allowed OPTIONS for login endpoint
const loginOptions = (req, res) =>
  res.status(200).set("Allow", "POST, OPTIONS").send();

// Call service layer to handle logout revocation
const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  return successResponse(res, 200, "User logged out successfully");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { mockToken } = await authService.forgotPassword(req.body.email);
  return successResponse(res, 200, "Password reset token sent to email", { mockToken });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  return successResponse(res, 200, "Password reset successfully");
});

const refreshToken = asyncHandler(async (req, res) => {
  const { token } = await authService.refreshToken(req.body.refreshToken);
  return successResponse(res, 200, "Token refreshed successfully", { token });
});

const getMe = asyncHandler(async (req, res) => {
  const data = await authService.getCurrentUser(req.user.id);
  return successResponse(res, 200, "User profile fetched successfully", data);
});

// Provide HEAD response for profile checks
const checkMeHeaders = (req, res) =>
  res.status(200).set("Allow", "GET, HEAD").send();

const sendOtp = asyncHandler(async (req, res) => {
  await authService.sendOTP(req.body.email);
  return successResponse(res, 200, "OTP sent successfully");
});

const verifyOtp = asyncHandler(async (req, res) => {
  await authService.verifyOTP(req.body.email, req.body.otp);
  return successResponse(res, 200, "OTP verified successfully");
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(
    req.user.id,
    req.body.oldPassword,
    req.body.newPassword,
  );
  return successResponse(res, 200, "Password changed successfully");
});

const updatePreferences = asyncHandler(async (req, res) => {
  const preferences = await authService.updatePreferences(req.user.id, req.body);
  return successResponse(res, 200, "Preferences updated successfully", preferences);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  return successResponse(res, 200, "Profile updated successfully", user);
});

const exportData = asyncHandler(async (req, res) => {
  const data = await authService.exportData(req.user.id);
  return successResponse(res, 200, "Account data exported successfully", data);
});

const createBackup = asyncHandler(async (req, res) => {
  const data = await authService.createBackup(req.user.id);
  return successResponse(res, 200, "Backup created successfully", data);
});

const deactivateAccount = asyncHandler(async (req, res) => {
  await authService.deactivateAccount(req.user.id);
  return successResponse(res, 200, "Account deactivated successfully");
});

const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAccount(req.user.id);
  return successResponse(res, 200, "Account permanently deleted");
});

const revokeSession = asyncHandler(async (req, res) => {
  const sessions = await authService.revokeSession(req.user.id, req.params.sessionId);
  return successResponse(res, 200, "Session revoked successfully", sessions);
});

module.exports = {
  register,
  login,
  loginOptions,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
  checkMeHeaders,
  sendOtp,
  verifyOtp,
  changePassword,
  updatePreferences,
  updateProfile,
  exportData,
  createBackup,
  deactivateAccount,
  deleteAccount,
  revokeSession,
};
