const spotifyAuth = async (): Promise<any> => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/spotify`;
    };
export default spotifyAuth