// Auth for login
export const spotifyLoginAuth = async (): Promise<any> => {
  window.location.href = `${import.meta.env.VITE_SPOTIFY_LOGIN_REDIRECT_URI}`;
};

// Auth for settings page
export const spotifySettingsAuth = async (): Promise<any> => {
  window.location.href = `${import.meta.env.VITE_SPOTIFY_SETTINGS_REDIRECT_URI}`;
};
