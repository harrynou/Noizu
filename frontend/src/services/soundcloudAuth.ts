const SoundCloudAuth = (): void => {
    const clientId: string = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID;
    const redirectUri: string = import.meta.env.VITE_REDIRECT_URI;
    const responseType: string = 'code';
    const codeChallenge: string = 'Fx6Oin9wZEi35rdNBFSGW1tDXpFPtJyZVIpQ4wtoZlg';
    const codeChallengeMethod: string = 'S256';
    const state: string = 'random';

    const url: string = `https://secure.soundcloud.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=${responseType}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}&state=${state}`;
    
    window.location.href = url;
};

export default SoundCloudAuth;
