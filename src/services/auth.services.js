import User from '../models/user.model.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { sendOtpEmail } from '../utils/resend.js';

const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerService = async (data) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const user = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    await user.save();

    await sendOtpEmail(user.email, otp, {
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });

    const {
      password,
      otp: _otp,
      otpExpiresAt: _exp,
      ...safeUser
    } = user.toObject();
    return safeUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verifyEmailService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error('Email and OTP are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    throw new Error('Email already verified');
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error('No OTP found, please request a new one');
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    throw new Error('OTP has expired, please request a new one');
  }

  if (user.otp !== String(otp)) {
    throw new Error('Invalid OTP');
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const {
    password,
    otp: _otp,
    otpExpiresAt: _exp,
    ...safeUser
  } = user.toObject();
  return safeUser;
};

export const loginService = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('An error occur');
  }

  // if (!user.isVerified) {
  //   throw new Error('Please verify your email before logging in');
  // }

  return user;
};
