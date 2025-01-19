declare module 'passport-soundcloud' {
    import { OAuth2Strategy, StrategyOptions, VerifyFunction } from 'passport-oauth2';
  
    export interface SoundCloudStrategyOptions extends StrategyOptions {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
      
    }
  
    export class Strategy extends OAuth2Strategy {
      constructor(options: SoundCloudStrategyOptions, verify: VerifyFunction);
      authenticate(req: Express.Request, options?: object): void;
    }
  
    export { Strategy as SoundCloudStrategy };
  }
  