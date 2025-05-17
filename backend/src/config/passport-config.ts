import passport from 'passport';
import { Profile, Strategy as SpotifyStrategy, VerifyCallback} from 'passport-spotify';
export const passportConfig = ():void => {
  passport.use(
      new SpotifyStrategy(
        {
          clientID: process.env.SPOTIFY_CLIENT_ID || '',
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
          callbackURL: process.env.SPOTIFY_REDIRECT_URI || '',
          scope: ["user-read-private", "user-read-email", "user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing", "streaming"]
        },
      async (accessToken: string, refreshToken: string, expires_in: number, profile: Profile, done: VerifyCallback) => {
        try {
          done(null,profile, {accessToken, refreshToken, expires_in})
        } catch (error:any) {
          done(error);
        }
      }
    )
  );
}



