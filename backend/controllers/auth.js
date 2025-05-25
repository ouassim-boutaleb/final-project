const db = require("../db/models/index");
const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");
const asyncWrapper = require("../middlewares/async");
const bcrypt = require('bcrypt');
const { sendOTP } = require("../utils/OtpVerification");
const { StatusCodes } = require("http-status-codes");
// const {saveBase64Image} = require("../utils/saveBase64Image");
require("dotenv").config();


const refreshToken = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log("refreshToken", refreshToken);
  if (!refreshToken) {
    return res.status(403).json({ msg: "Refresh token is invalid" });
  }
  //verify token ( DB and JWT)
  const storedToken = await db.refreshToken.verifyToken(refreshToken);
  if (!storedToken) {
    throw new ForbiddenError("Invalid refresh token");
  }
  // GET the user
  const user = await db.Users.findOne({
    where: { id: storedToken.userId },
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  //generate the new access token
  const newAccessToken = await user.generateAccessToken();
  //generate the new refresh token
  res.cookie('refreshToken', storedToken.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: process.env.COOKIE_AGE, // 15 minutes
  });
  return res.status(200).json({
    msg: "Token refreshed successfully",
    accessToken: newAccessToken,
  });
});
const register = asyncWrapper(async (req, res) => {
  
  const { firstname, lastname, email, password, userType, phoneNumber, category, paperBase64 } =
  req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !userType ||
    !phoneNumber ||
    !category ||
    !paperBase64
  ) {
    throw new BadRequestError("Please fill all fields");
  }
  //image path
  // const imagePath = await saveBase64Image(paperBase64 , "paper", "user_paper");
  const user = await db.Users.create({
    firstname,
    lastname,
    email,
    phoneNumber,
    password,
    userType,
    category,
    isVerified: false,
    paper: paperBase64,
  });

await sendOTP(user);

  return res.status(StatusCodes.CREATED).json({
    message: "User created successfully",
    user,
  });
});

const login = asyncWrapper(async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    throw new BadRequestError("Please provide phone or email and password");
  }
  const user = await db.Users.findOne({
    where: {
      [db.Sequelize.Op.or]: [
        { email: identifier },
        { phoneNumber: identifier },
      ],
    },
  });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const accessToken = await user.generateAccessToken();
  const refreshTokenDb = await db.refreshToken.generateToken(user.id);
  const refreshToken = refreshTokenDb.token;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict",
    maxAge: 7*24*60*60*1000, // 7 days
  });
  
  return res.status(200).json({
    message: "User logged in successfully",
    user,
    accessToken
  });
});

const logout = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log("refreshToken", refreshToken);
  if (!refreshToken) {
    throw new BadRequestError("Please provide a refresh token");
  }
  const storedToken = await db.refreshToken.verifyToken(refreshToken);
  if (!storedToken) {
    throw new ForbiddenError("Invalid or expired refresh token");
  }
  await db.refreshToken.deleteToken(refreshToken, storedToken.userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "User logged out successfully" });
});

const requestOtpReset = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide an email address");
  }
  const user = await db.Users.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  await sendOTP(user);
  return res.status(200).json({ message: "Reset password OTP sent" });
});

const resetPassword = asyncWrapper(async (req, res) => {
  const { email, otp , newPassword} = req.body;
  if ( !email || !otp || !newPassword) {
    throw BadRequestError('Please provide email, otp and new password');
  }
  const user = await db.Users.findOne({ where: { email } });

  if ( !user || !user.otpCode || user.otpCode !== otp || new Date() > user.otpExpiresAt) {
    throw new BadRequestError('Invalid or expired OTP');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({ password: hashedPassword, otpCode:null, otpExpiresAt: null });

  res.status(StatusCodes.OK).json({ message: 'Password reset successfully' });

})


module.exports = { register, refreshToken, login, logout, requestOtpReset, resetPassword };