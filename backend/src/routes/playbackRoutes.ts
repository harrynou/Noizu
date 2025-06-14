import { Router } from "express";
import * as playbackController from "../controllers/playbackControllers";
import { validateRequest } from "../middleware/validateRequest";
import { authenticateJWT } from "../middleware/jwtAutenticate";
import { favoriteTrackDto, volumeDto } from "../dtos/dtos";
// Any Apis having to do with playback or music related logic

const router = Router();
router.put("/volume", authenticateJWT, validateRequest(volumeDto, "body"), playbackController.updateVolume);
export default router;
