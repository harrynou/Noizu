import {Router} from 'express';
import * as authController from '../controllers/authControllers'
import { validateRequest } from '../middleware/validateRequest';
import { authenticateJWT } from '../middleware/jwtAutenticate';
import {userCredentialsDto, userPasswordChangeDto} from '../dtos/dtos'
import passport from 'passport'

const router = Router()
router.get('/checkAuth', authenticateJWT, authController.checkAuth)
router.post('/token', authenticateJWT, authController.token)
router.post("/registerUser", validateRequest(userCredentialsDto, 'body'), authController.registerUser)
router.get('/spotify', passport.authenticate('spotify', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login`}));
router.get('/spotify/callback', passport.authenticate('spotify', { session: false }), authController.spotifyAuth)
router.get('/soundcloud', authController.soundcloudRedirect)
router.get('/soundcloud/callback', authController.soundcloudAuth)
router.post('/signIn', validateRequest(userCredentialsDto, 'body'), authController.signInUser)
router.post('/setupAccount', authenticateJWT, validateRequest(userCredentialsDto, 'body'), authController.setupAccount)
router.post('/changePassword', authenticateJWT, validateRequest(userPasswordChangeDto, 'params'), authController.changePassword)
router.post('/logout', authController.logout)

export default router;
