import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const registerUser = async (email:string, password:string): Promise<any> => {
    try {
        const response = await axiosInstance.post("/api/auth/registerUser", {email,password});
        return response.data
    } catch (error:any) {
        if (error.response) {
            throw error.response;
        } 
        throw new Error("An unexpected error occured.");
    }
}

export const signInUser = async (email:string, password:string): Promise<any> => {
    try{
        const response = await axiosInstance.post("/api/auth/signIn", {email,password});
        return response
    } catch (error:any) {
        if (error.response) {
        return error.response;
        }
        throw new Error("An unexpected error occured.");
    }
}