
const SpotifyAuth = (): void => {
    const clientId: string = "dc8791f86a40407db586fac1640de978"
    const responseType: string = 'code'
    const redirectUri: string = "http://localhost:5173/callback"
    const url: string = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}`
    window.location.href = url
}

export default SpotifyAuth