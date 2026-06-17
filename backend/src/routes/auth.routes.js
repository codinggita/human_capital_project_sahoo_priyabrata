const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { validateRequest } = require("../middlewares/validate.middleware");

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateSendOTP,
  validateVerifyOTP,
} = require("../validators/auth.validator");

// Rate limiters to prevent brute force and spam
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// ==========================================
// 🔓 PUBLIC ROUTES
// ==========================================

router.post(
  "/register",
  validateRequest(validateRegister),
  authController.register,
);

router
  .route("/login")
  .post(loginLimiter, validateRequest(validateLogin), authController.login)
  .options(authController.loginOptions);

router.post(
  "/forgot-password",
  validateRequest(validateForgotPassword),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(validateResetPassword),
  authController.resetPassword,
);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/send-otp",
  validateRequest(validateSendOTP),
  authController.sendOtp,
);
router.post(
  "/verify-otp",
  validateRequest(validateVerifyOTP),
  authController.verifyOtp,
);

// ==========================================
// 🔐 PROTECTED ROUTES
// ==========================================

router.use(verifyJWT);

router.post("/logout", authController.logout);

router
  .route("/me")
  .get(authController.getMe)
  .head(authController.checkMeHeaders);

router.post(
  "/change-password",
  validateRequest(validateChangePassword),
  authController.changePassword,
);

router.put("/me", authController.updateProfile);
router.put("/me/preferences", authController.updatePreferences);
router.post("/me/export", authController.exportData);
router.post("/me/backup", authController.createBackup);
router.post("/me/deactivate", authController.deactivateAccount);
router.delete("/me", authController.deleteAccount);
router.delete("/me/sessions/:sessionId", authController.revokeSession);

module.exports = router;
