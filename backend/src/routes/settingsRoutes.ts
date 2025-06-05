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

router.get(
  "/spotify",
  passport.authenticate("spotify", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/settings`,
  })
);

router.get(
  "/spotify/callback",
  passport.authenticate("spotify", { session: false }),
  settingsController.spotifyConnect
);

router.get("/soundcloud", settingsController.soundcloudSettingsRedirect);
router.get("/soundcloud/callback", settingsController.soundcloudConnect);

export default router;
