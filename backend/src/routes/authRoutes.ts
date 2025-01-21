import {Router} from 'express';
import * as authController from '../controllers/authControllers'
import { validateRequest } from '../middleware/validateRequest';
import {userCredentialsDto} from '../dtos/dtos'
import passport from 'passport'
import {passportConfig} from '../config/passport-config'

const router = Router()
passportConfig();
router.get('/checkAuth', authController.checkAuth)
router.post("/registerUser", validateRequest(userCredentialsDto), authController.registerUser)
router.get('/spotify/callback', passport.authenticate('spotify', { session: false }), authController.spotifyAuth)
router.get('/soundcloud/callback', passport.authenticate('soundcloud', { session: false }), authController.soundcloudAuth)
router.post('/signIn', validateRequest(userCredentialsDto), authController.signInUser)
router.post('/changePassword', authController.changePassword)
router.post('/logout', authController.logout)
export default router;
