import passport from 'passport';
import { Profile, Strategy as SpotifyStrategy, VerifyCallback} from 'passport-spotify';
import {Strategy as SoundCloudStrategy } from 'passport-soundcloud';
require('dotenv').config()
export const passportConfig = ():void => {
  passport.use(
      new SpotifyStrategy(
        {
          clientID: process.env.SPOTIFY_CLIENT_ID || '',
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
          callbackURL: process.env.SPOTIFY_REDIRECT_URI || '',
          scope: ["user-read-private", "user-read-email"]
        },
      async (accessToken: string, refreshToken: string, expires_in: number, profile: Profile, done: VerifyCallback) => {
        try {
          done(null,profile, {accessToken, refreshToken, expires_in})
        } catch (error:any) {
          done(error);
        }
      }
    )
  )

  passport.use(
    new SoundCloudStrategy ({
        clientID: process.env.SPOTIFY_CLIENT_ID || '',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
        callbackURL: process.env.SPOTIFY_REDIRECT_URI || '',
        authorizationURL: 'https://secure.soundcloud.com/authorize',
        tokenURL:'https://secure.soundcloud.com/oauth/token'
    },async (accessToken: string, refreshToken: string, expires_in: number, profile: Profile, done: VerifyCallback) => {
      try {
        done(null,profile, {accessToken, refreshToken, expires_in})
      } catch (error:any) {
        done(error);
      }
    })
  )
}