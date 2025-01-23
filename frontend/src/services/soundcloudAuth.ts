const soundcloudAuth = async (): Promise<any> => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/soundcloud`;
    };
export default soundcloudAuth
