import { Router } from 'express';
import * as playlistController from '../controllers/playlistControllers';
import { authenticateJWT } from '../middleware/jwtAutenticate';
import { createPlaylistDTO, playlistTrackDTO, removePlaylistDTO, getPlaylistTracks } from '../dtos/dtos';
import { validateRequest } from '../middleware/validateRequest';
import { uploadImage, handleMulterError } from '../middleware/upload';

const router = Router();

// Playlist 
router.get('/', authenticateJWT, playlistController.getPlaylists);
router.put('/', authenticateJWT, uploadImage.single('playlistCover'), handleMulterError, validateRequest(createPlaylistDTO, 'body'), playlistController.createPlaylist);
router.delete('/', authenticateJWT, validateRequest(removePlaylistDTO, 'body'), playlistController.removePlaylist);

// Playlist Track's
router.get('/tracks', authenticateJWT, validateRequest(getPlaylistTracks, 'body'), playlistController.getPlaylistTracks);
router.put('/track', authenticateJWT, validateRequest(playlistTrackDTO, 'body'), playlistController.addTrack);
router.delete('/track', authenticateJWT, validateRequest(playlistTrackDTO, 'body'), playlistController.removeTrack);


export default router;