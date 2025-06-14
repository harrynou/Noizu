import { Router } from "express";
import { authenticateJWT } from "../middleware/jwtAutenticate";
import { validateRequest } from "../middleware/validateRequest";
import { favoriteTrackDto } from "../dtos/dtos";
import * as trackController from "../controllers/trackControllers";

const router = Router();

router.post("/favorite", authenticateJWT, validateRequest(favoriteTrackDto, "body"), trackController.favoriteTrack);
router.delete("/favorite", authenticateJWT, validateRequest(favoriteTrackDto, "body"), trackController.unfavoriteTrack);
router.get("/favorite", authenticateJWT, trackController.getFavorites);
export default router;
