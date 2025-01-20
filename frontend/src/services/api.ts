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
        return response
    } catch (error:any) {
        throw error
    }
}