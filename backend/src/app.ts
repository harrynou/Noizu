import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import playbackRoutes from "./routes/playbackRoutes";
import trackRoutes from "./routes/trackRoutes";
import playlistRoutes from "./routes/playlistRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import errorHandle from "./middleware/errorHandle";
import passport from "passport";
import { passportConfig } from "./config/passport-config";

const app: Application = express();

passportConfig();

const allowedOrigins = [process.env.FRONTEND_BASE_URL, "https://accounts.spotify.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: Origin ${origin} not allowed.`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/playback", playbackRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/settings", settingsRoutes);
app.use(errorHandle);

export default app;
