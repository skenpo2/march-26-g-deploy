import {
  loginService,
  registerService,
  verifyEmailService,
} from '../services/auth.services.js';

export const registerUser = async (req, res) => {
  try {
    const data = req.body;

    const user = await registerService(data);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const data = req.body;

    const user = await loginService(data);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await verifyEmailService({ email, otp });

    res.status(200).json({ message: 'Email verified successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
