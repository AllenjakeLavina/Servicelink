import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async signup(userData: UserInput) {
    try {
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Email, password, and name are required');
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          name: userData.name
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },

  async login(loginData: LoginInput) {
    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('Email and password are required');
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email.toLowerCase() }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }
}; 