import axios, { AxiosInstance } from "axios";
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(new Error("An unexpected error occurred."));
    }
);

// APIs dealing with authentification 

export const checkAuth = async (): Promise<any> => {
    try{
        const response = await axiosInstance.get('/api/auth/checkAuth');
        return response.data
    } catch (error:any) {
        throw error
    }
}

export const registerUser = async (email:string, password:string): Promise<any> => {
    try {
        const response = await axiosInstance.post("/api/auth/registerUser", {email,password});
        return response.data
    } catch (error:any) {
        throw error
    }
}

export const signInUser = async (email:string, password:string): Promise<any> => {
    try{
        const response = await axiosInstance.post("/api/auth/signIn", {email,password});
        return response.data
    } catch (error:any) {
        throw error
    }
}

export const changePassword = async (password:string): Promise<any> => {
    try {
        const response = await axiosInstance.post("/api/auth/changePassword", {password});
        return response.data
    } catch (error) {
        throw error
    }
}

export const setUpAccount = async (email: string, password:string): Promise<any> => {
    try {
        const response =  await axiosInstance.post('/api/auth/setupAccount', {email,password});
        return response.data
    } catch (error) {
        throw error
    }
}
    
export const logoutUser = async (): Promise<void> => {
    try {
        await axiosInstance.post("/api/auth/logout");
    } catch (error) {
        throw error
    }
}

export const searchQuery = async (query:string, provider: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`/api/search/${query}/${provider}`);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getAccessToken = async (provider: string): Promise<string> => {
    try {
        const response = await axiosInstance.post('/api/auth/token', {provider:provider});
        const token =response.data.token
        return token
    } catch (error) {
        throw error
    }
}



// APIs dealing with Spotify 


interface TransferPlaybackOptions {
    token: string | null;
    device_id: string;
}

export const transferSpotifyPlayback = async ({ token, device_id}: TransferPlaybackOptions): Promise<void> => {
    const requestBody = { device_ids: [device_id], play: false };
    try {
        await axios.put(
            'https://api.spotify.com/v1/me/player',
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error: any) {
            console.error('Error transferring playback:', error);
            throw error;
        }
};

interface startPlaybackOptions {
    token: string,
    device_id: string;
    uris: string[];
}

export const startSpotifyPlayback = async ({token, device_id, uris}:startPlaybackOptions): Promise<void> => {
    const requestBody = {uris, position_ms: 0}
    try {
        await axios.put(
            `https://api.spotify.com/v1/me/player/play/?device_id=${device_id}`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
    } catch (error:any) {
        console.error('Error in starting playback:', error)
    }
}


// APIs dealing with SoundCloud