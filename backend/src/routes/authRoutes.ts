import {Router} from 'express';
import * as authController from '../controllers/authControllers'
import { validateRequest } from '../middleware/validateRequest';
import {userCredentialsDto, userPasswordChangeDto} from '../dtos/dtos'
import passport from 'passport'

const router = Router()
router.get('/checkAuth', authController.checkAuth)
router.post("/registerUser", validateRequest(userCredentialsDto), authController.registerUser)
router.get('/spotify', passport.authenticate('spotify', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login`}));
router.get('/spotify/callback', passport.authenticate('spotify', { session: false }), authController.spotifyAuth)
router.get('/soundcloud', passport.authenticate('soundcloud', {session: false}))
router.get('/soundcloud/callback', passport.authenticate('soundcloud', { session: false }), authController.soundcloudAuth)
router.post('/signIn', validateRequest(userCredentialsDto), authController.signInUser)
router.post('/changePassword', validateRequest(userPasswordChangeDto), authController.changePassword)
router.post('/logout', authController.logout)
export default router;
