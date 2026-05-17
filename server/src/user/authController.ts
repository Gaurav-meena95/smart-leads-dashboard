import { Request, Response } from 'express';
import User from './userdb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationInput } from '../utils';

const sec_key = process.env.sec_key as string;

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;
    const value = validationInput({ name, email, password, role });
    if (value) {
      return res.status(400).json({ success: false, message: `Check missing value ${value}` });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include a special character" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).json({ success: true, message: "User created successfully", data: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    const value = validationInput({ email, password, role });
    if (value) {
      return res.status(400).json({ success: false, message: `Check missing value ${value}` });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email, role or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "Your account is blocked" });
    }

    const isMatch = bcrypt.compareSync(password, user.password as string);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, sec_key, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, sec_key, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
