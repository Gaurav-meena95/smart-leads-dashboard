import express from 'express';
import { signup, login } from './authController';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);

export default router;
