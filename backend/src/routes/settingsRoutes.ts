import { Router } from "express";
import { authenticateJWT } from "../middleware/jwtAutenticate";
import { validateRequest } from "../middleware/validateRequest";
import { disconnectProviderDto, userCredentialsDto, userPasswordChangeDto } from "../dtos/dtos";
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
  validateRequest(userPasswordChangeDto, "body"),
  settingsController.changePassword
);

router.get("/connect/spotify", authenticateJWT, settingsController.connectSpotifyInit, (req, res, next) => {
  const state = (req as any).oauthState;
  passport.authenticate("spotify-settings", {
    session: false,
    state: state,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/settings?error=spotify_auth_failed`,
  })(req, res, next);
});

// SoundCloud connection
router.get("/connect/soundcloud", authenticateJWT, settingsController.connectSoundcloud);

router.get(
  "/spotify/callback",
  passport.authenticate("spotify-settings", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/settings?error=spotify_callback_failed`,
  }),
  settingsController.spotifyConnect
);

router.get("/soundcloud/callback", settingsController.soundcloudConnect);

// Disconnect provider
router.delete(
  "/disconnect/:provider",
  authenticateJWT,
  validateRequest(disconnectProviderDto, "params"),
  settingsController.disconnectProvider
);

router.get("/connections", authenticateJWT, settingsController.getConnections);

router.get("/profile", authenticateJWT, settingsController.getProfile);

export default router;
