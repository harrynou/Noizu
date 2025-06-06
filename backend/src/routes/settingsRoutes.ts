import { Router } from "express";
import { authenticateJWT } from "../middleware/jwtAutenticate";
import { validateRequest } from "../middleware/validateRequest";
import { userCredentialsDto, userPasswordChangeDto } from "../dtos/dtos";
import * as settingsController from "../controllers/settingsControllers";
import passport from "passport";

const router = Router();

router.post(
  "/setupAccount",
  authenticateJWT,
  validateRequest(userCredentialsDto, "body"),
  settingsController.setupAccount
);
router.post(
  "/changePassword",
  authenticateJWT,
  validateRequest(userPasswordChangeDto, "params"),
  settingsController.changePassword
);

router.get("/spotify", authenticateJWT, settingsController.connectSpotifyInit, (req, res, next) => {
  const state = (req as any).oauthState;
  passport.authenticate("spotify-settings", {
    session: false,
    state: state,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/settings?error=spotify_auth_failed`,
  })(req, res, next);
});

router.get(
  "/spotify/callback",
  passport.authenticate("spotify-settings", { session: false }),
  settingsController.spotifyConnect
);

router.get("/soundcloud", authenticateJWT, settingsController.soundcloudSettingsRedirect);
router.get("/soundcloud/callback", settingsController.soundcloudConnect);

export default router;
