import { Router } from 'express';
import * as playlistController from '../controllers/playlistControllers';
import { authenticateJWT } from '../middleware/jwtAutenticate';
import { createPlaylistDTO, playlistTrackDTO } from '../dtos/dtos';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', authenticateJWT, playlistController.getPlaylists);
router.put('/', authenticateJWT, validateRequest(createPlaylistDTO, 'body'), playlistController.createPlaylist);
router.put('/track', authenticateJWT, validateRequest(playlistTrackDTO, 'body'), playlistController.addTrack);
router.delete('/track', authenticateJWT, validateRequest(playlistTrackDTO, 'body'), playlistController.removeTrack);


export default router;