// Auth for login
export const soundcloudLoginAuth = async (): Promise<any> => {
  window.location.href = `${import.meta.env.VITE_SOUNDCLOUD_LOGIN_REDIRECT_URI}`;
};

// Auth for settings page
export const soundcloudSettingsAuth = async (): Promise<any> => {
  window.location.href = `${import.meta.env.VITE_SOUNDCLOUD_SETTINGS_REDIRECT_URI}`;
};
