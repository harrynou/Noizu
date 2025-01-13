import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'applications/json',
    },
});

export const registerUser = async (email:string, password:string): Promise<any> => {
    try {
        const response = await axiosInstance.post("/api/auth/register", {email,password});
        return response
    } catch (error:any) {
        return error
    }
}

export const signInUser = async (email:string, password:string): Promise<any> => {
    try{
        const response = await axiosInstance.post("/api/auth/signIn", {email,password});
        return response
    } catch (error:any) {
        return error
    }
}