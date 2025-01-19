import {Router} from 'express';
import * as authController from '../controllers/authControllers'
import { validateRequest } from '../middleware/validateRequest';
import {userCredentialsDto} from '../dtos/dtos'
import passport from 'passport'
import {passportConfig} from '../config/passport-config'

const router = Router()
passportConfig();
router.post('/checkAuth', authController.checkAuth)
router.post("/registerUser", validateRequest(userCredentialsDto), authController.registerUser)
router.get('/spotify/callback', passport.authenticate('spotify', { session: false }), authController.spotifyRegister)
router.get('/soundcloud/callback', passport.authenticate('soundcloud', { session: false }), authController.soundcloudRegister)
router.post('/login', validateRequest(userCredentialsDto), authController.loginUser)
export default router;
