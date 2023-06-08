import express from 'express';
import { signup, login, deleteAccount, refreshToken } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.delete('/delete', deleteAccount);
router.post('/refresh-token', refreshToken);

export default router;