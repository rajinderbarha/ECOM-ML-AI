import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;