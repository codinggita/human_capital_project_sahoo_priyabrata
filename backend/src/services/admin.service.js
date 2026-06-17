const User = require("../models/user.model");
const Price = require("../models/price.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const getAdminDashboardService = async () => {
  // Use estimatedDocumentCount for instant results on 190k records
  const [totalUsers, totalPrices] = await Promise.all([
    User.countDocuments(),
    Price.estimatedDocumentCount(),
  ]);
  return { totalUsers, totalPrices, status: "Healthy" };
};

const getAdminStatisticsService = async () => {
  return { message: "Admin detailed stats generated here" };
};

const getAllUsersService = async (queryObj) => {
  const { page, limit, skip } = getPagination(queryObj);
  const [data, totalDocs] = await Promise.all([
    User.find().skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);
  return { data, pagination: getPaginationMeta(totalDocs, page, limit) };
};

const getUserByIdService = async (id) => User.findById(id).lean();

const createUserService = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) {
    const error = new Error("Email is already registered");
    error.code = 11000;
    throw error;
  }
  return User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user',
  });
};

const updateUserRoleService = async (id, updateData) => {
  const user = await User.findById(id).select("+password");
  if (!user) return null;

  if (updateData.name) user.name = updateData.name;
  if (updateData.email) user.email = updateData.email;
  if (updateData.role) user.role = updateData.role;
  if (updateData.password) user.password = updateData.password;

  const savedUser = await user.save();
  savedUser.password = undefined;
  return savedUser;
};
const deleteUserService = async (id) => User.findByIdAndDelete(id);

const adminCreatePriceService = async (data) => Price.create(data);
const adminUpdatePriceService = async (id, data) =>
  Price.findByIdAndUpdate(id, data, { new: true });
const adminDeletePriceService = async (id) => Price.findByIdAndDelete(id);

const getAllPricesService = async (queryObj) => {
  const { page, limit, skip } = getPagination(queryObj);
  const [data, totalDocs] = await Promise.all([
    Price.find().skip(skip).limit(limit).lean(),
    Price.countDocuments(),
  ]);
  return { data, pagination: getPaginationMeta(totalDocs, page, limit) };
};

module.exports = {
  getAdminDashboard: getAdminDashboardService,
  getAdminAnalytics: getAdminStatisticsService,
  getAdminStatistics: getAdminStatisticsService,
  getAllUsers: getAllUsersService,
  createUser: createUserService,
  getUserById: getUserByIdService,
  updateUserRole: updateUserRoleService,
  deleteUser: deleteUserService,
  getAllPrices: getAllPricesService,
  createPrice: adminCreatePriceService,
  updatePrice: adminUpdatePriceService,
  deletePrice: adminDeletePriceService,
};
