import crypto from "crypto";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/encryption";
import { getToken, setToken } from "./redis";

export const grabTrackIds = (tracks: any[], provider?: string) => {
  if (provider) {
    return tracks
      .filter((track) => (track.provider === provider ? track.track_id : null))
      .map((track) => track.track_id);
  } else {
    return tracks.map((track) => track.track_id);
  }
};
// Creates url for soundcloud redirect for OAuth
export const soundcloudRedirectHelper = async (callback: string | undefined, userId?: number) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    await setToken(`authState:${state}`, { codeVerifier, userId }, 600);
    return `https://secure.soundcloud.com/authorize?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}&redirect_uri=${callback}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
  } catch (error) {
    throw error;
  }
};

// Helper function for SoundCloud settings OAuth
export const soundcloudRedirectHelperForSettings = async (callback: string | undefined, state: string) => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Update the stored data to include code verifier
    const existingData = await getToken(`oauth_state:${state}`);
    if (existingData) {
      await setToken(`oauth_state:${state}`, { ...existingData, codeVerifier }, 600);
    }

    return `https://secure.soundcloud.com/authorize?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}&redirect_uri=${callback}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
  } catch (error) {
    throw error;
  }
};
