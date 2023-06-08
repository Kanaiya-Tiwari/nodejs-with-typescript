import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
const accessTokenSecret = 'your-access-token-secret';
const refreshTokenSecret = 'your-refresh-token-secret';
const accessTokenExpiry = '120s';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user: IUser = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error:any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate access token
    const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, { expiresIn: accessTokenExpiry });

    // Generate refresh token
    const refreshToken = jwt.sign({ email: user.email }, refreshTokenSecret);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Delete user
    await User.findOneAndDelete({ email });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  jwt.verify(refreshToken, refreshTokenSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ email: decoded.email }, accessTokenSecret, { expiresIn: accessTokenExpiry });

    res.json({ accessToken });
  });
};