import {Router} from 'express';
import * as authController from '../controllers/authControllers'
import { validateRequest } from '../middleware/validateRequest';
import {RegisterUserDtos} from '../dtos/dtos'
import passport from 'passport'
import {passportConfig} from '../config/passport-config'

const router = Router()
passportConfig();
router.post("/registerUser", validateRequest(RegisterUserDtos), authController.registerUser)
router.get('/spotify/callback', passport.authenticate('spotify', { session: false }), authController.spotifyRegister)

export default router;

/*
4. Check if email account is already connected, if so send response 'account in use' to frontend, else, create account and connect provider
*/