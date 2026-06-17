const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email format"],
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false, // Prevent password leaks in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    preferences: {
      notifs: {
        email: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true },
        warnings: { type: Boolean, default: true },
        reports: { type: Boolean, default: false },
        aiInsights: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
      },
      aiPrefs: {
        predictions: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true },
        autoReports: { type: Boolean, default: false },
        telemetry: { type: Boolean, default: true },
        smartInsights: { type: Boolean, default: true },
      },
      appearancePrefs: {
        themeMode: { type: String, default: 'dark' },
        appearance: {
          neumorphism: { type: Boolean, default: true },
          animations: { type: Boolean, default: true },
          density: { type: String, default: 'comfortable' },
          glassIntensity: { type: Number, default: 5 },
        }
      }
    },
    stats: {
      apiCallsToday: { type: Number, default: 0 },
      activeSessions: { type: Number, default: 1 },
      loginStreak: { type: Number, default: 0 },
      securityScore: { type: Number, default: 85 }, // default base score
      lastLoginDate: { type: Date, default: Date.now },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sessionsList: [
      {
        device: { type: String },
        location: { type: String },
        time: { type: Date, default: Date.now },
      }
    ]
  },
  {
    timestamps: true,
  },
);

// Hash password before saving user document to DB
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare incoming password with hashed password safely
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate short-lived JWT Access Token for standard authentication
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

// Generate long-lived Refresh Token for session persistence
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
  );
};

module.exports = mongoose.model("User", userSchema);
