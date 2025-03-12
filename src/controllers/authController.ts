import { Request, Response } from 'express';
import { authService, UserInput, LoginInput } from '../services/authService';

export const authController = {
  async signup(req: Request, res: Response) {
    try {
      console.log('Received signup request with body:', req.body);
      const userData: UserInput = req.body;
      const result = await authService.signup(userData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Signup error:', error.message);
      res.status(400).json({ message: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      console.log('Received login request with body:', req.body);
      const loginData: LoginInput = req.body;
      const result = await authService.login(loginData);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Login error:', error.message);
      res.status(401).json({ message: error.message });
    }
  }
}; 