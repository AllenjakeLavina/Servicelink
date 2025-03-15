import express from 'express';
import { authService } from '../services/authService';

const router = express.Router();

// Client routes
router.post('/signup', async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Client login attempt:', req.body);
    const result = await authService.login(req.body);
    console.log('Client login result:', result);
    res.json(result);
  } catch (error: any) {
    console.error('Client login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Worker routes
router.post('/worker/signup', async (req, res) => {
  try {
    const result = await authService.workerSignup(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/worker/login', async (req, res) => {
  try {
    console.log('Worker login attempt:', req.body);
    const result = await authService.workerLogin(req.body);
    console.log('Worker login result:', result);
    res.json(result);
  } catch (error: any) {
    console.error('Worker login error:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router; 