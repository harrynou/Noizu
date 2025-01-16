import {Router} from 'express';
import * as authController from '../controllers/authControllers'
import { validateRequest } from '../middleware/validateRequest';
import {RegisterUserDtos} from '../dtos/dtos'

const router = Router()

router.post("/registerUser", validateRequest(RegisterUserDtos), authController.registerUser)

export default router;