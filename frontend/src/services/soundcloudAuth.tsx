const SoundCloudAuth = (): void => {
    const clientId: string = 'Bnxu6VRAz8WkMbHT4SfIucWCLaE96z9C'
    const redirectUri: string = 'http://localhost:5173'
    const responseType: string = 'code'
    const codeChallenge: string = 'Fx6Oin9wZEi35rdNBFSGW1tDXpFPtJyZVIpQ4wtoZlg'
    const codeChallengeMethod: string = 'S256'
    const state: string = 'random'
    const url: string = `https://secure.soundcloud.com/authorize/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}&state=${state}`
    window.location.href = url
}  

export default SoundCloudAuth