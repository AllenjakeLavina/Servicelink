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
  phoneNumber?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface WorkerInput {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  skills: string;
  experience: string;
  rate: number;
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
          name: userData.name,
          phoneNumber: userData.phoneNumber
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
          name: user.name,
          phoneNumber: user.phoneNumber
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

      const user = await prisma.user.findUnique({
        where: { email: loginData.email.toLowerCase() }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: 'client' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: 'client'
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },

  async workerSignup(userData: WorkerInput) {
    try {
      if (!userData.email || !userData.password || !userData.name || !userData.skills || !userData.experience || !userData.rate) {
        throw new Error('All required fields must be filled');
      }

      const existingWorker = await prisma.worker.findUnique({
        where: { email: userData.email.toLowerCase() }
      });

      if (existingWorker) {
        throw new Error('Worker already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const worker = await prisma.worker.create({
        data: {
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          skills: userData.skills,
          experience: userData.experience,
          rate: userData.rate
        }
      });

      const token = jwt.sign(
        { workerId: worker.id, email: worker.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...workerWithoutPassword } = worker;

      return {
        worker: workerWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  },

  async workerLogin(loginData: LoginInput) {
    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('Email and password are required');
      }

      const worker = await prisma.worker.findUnique({
        where: { email: loginData.email.toLowerCase() }
      });

      if (!worker) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(loginData.password, worker.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { workerId: worker.id, email: worker.email, role: 'worker' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: worker.id,
          email: worker.email,
          name: worker.name,
          phoneNumber: worker.phoneNumber,
          skills: worker.skills,
          experience: worker.experience,
          rate: worker.rate,
          role: 'worker'
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }
}; 