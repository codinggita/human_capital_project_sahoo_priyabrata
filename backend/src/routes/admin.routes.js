const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const adminController = require("../controllers/admin.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

// Strict admin rate limiting
const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });

// Protect and strictly authorize all admin routes using smart verification
router.use(verifyJWT);

router.use(authorizeRoles("admin"));
router.use(adminLimiter);

// Dashboards and Analytics
router.get("/dashboard", adminController.getAdminDashboard);
router.get("/analytics", adminController.getAdminAnalytics);
router.get("/stats", adminController.getAdminStats);
router
  .route("/users")
  .get(adminController.getAllUsers)
  .post(adminController.createUser);

// Admin-specific Prices Management
router
  .route("/prices")
  .get(adminController.getAdminPrices)
  .post(adminController.createAdminPrice)
  .options(adminController.adminPricesOptions);

router
  .route("/prices/:priceId")
  .patch(adminController.updateAdminPrice)
  .delete(adminController.deleteAdminPrice);

// Admin User Management
router
  .route("/users/:id")
  .get(adminController.getUserById)
  .patch(adminController.updateUserRole)
  .delete(adminController.deleteUser);

module.exports = router;
