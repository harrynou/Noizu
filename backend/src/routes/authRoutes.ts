import {Router} from 'express';
import * as authController from '../controllers/authControllers'

const router = Router()

router.post("/registerUser",authController.registerUser)

export default router;