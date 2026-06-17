const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseFormatter");
const adminService = require("../services/admin.service");

const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getAdminDashboard();
  return successResponse(
    res,
    200,
    "Admin dashboard fetched successfully",
    data,
  );
});

const getAdminAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getAdminAnalytics();
  return successResponse(
    res,
    200,
    "Admin analytics fetched successfully",
    data,
  );
});

const getAdminStats = asyncHandler(async (req, res) => {
  const data = await adminService.getAdminStatistics();
  return successResponse(res, 200, "Admin stats fetched successfully", data);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { data, pagination } = await adminService.getAllUsers(req.query);
  return successResponse(
    res,
    200,
    "Users fetched successfully",
    data,
    pagination,
  );
});

const createUser = asyncHandler(async (req, res) => {
  const data = await adminService.createUser(req.body);

  const io = req.app.get("io");
  if (io) {
    io.to("admin_room").emit("NEW_USER_REGISTERED", {
      _id: data._id,
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
    });
  }

  return successResponse(res, 201, "User created successfully", data);
});

const getUserById = asyncHandler(async (req, res) => {
  const data = await adminService.getUserById(req.params.id);
  return successResponse(res, 200, "User fetched successfully", data);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const data = await adminService.updateUserRole(req.params.id, req.body);
  return successResponse(res, 200, "User updated successfully", data);
});

const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  return successResponse(res, 200, "User deleted successfully");
});

// Admin Price Management
const getAdminPrices = asyncHandler(async (req, res) => {
  const { data, pagination } = await adminService.getAllPrices(req.query);
  return successResponse(
    res,
    200,
    "Prices fetched successfully",
    data,
    pagination,
  );
});

const createAdminPrice = asyncHandler(async (req, res) => {
  const data = await adminService.createPrice(req.body);
  return successResponse(res, 201, "Price created securely by admin", data);
});

const updateAdminPrice = asyncHandler(async (req, res) => {
  const data = await adminService.updatePrice(req.params.priceId, req.body);
  return successResponse(res, 200, "Price updated securely by admin", data);
});

const deleteAdminPrice = asyncHandler(async (req, res) => {
  await adminService.deletePrice(req.params.priceId);
  return successResponse(res, 200, "Price deleted securely by admin");
});

const adminPricesOptions = (req, res) =>
  res.status(200).set("Allow", "GET, POST, OPTIONS").send();

module.exports = {
  getAdminDashboard,
  getAdminAnalytics,
  getAdminStats,
  getAllUsers,
  createUser,
  getUserById,
  updateUserRole,
  deleteUser,
  getAdminPrices,
  createAdminPrice,
  updateAdminPrice,
  deleteAdminPrice,
  adminPricesOptions,
};
