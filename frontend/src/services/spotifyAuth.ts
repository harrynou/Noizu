
const SpotifyAuth = (): void => {
    const clientId: string = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID
    const redirectUri: string = import.meta.env.VITE_REDIRECT_URI
    const responseType: string = 'code'
    const url: string = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}`
    window.location.href = url
}

export default SpotifyAuth