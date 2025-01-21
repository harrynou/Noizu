import React, { useState } from "react" 
import {useNavigate } from 'react-router-dom';
import SpotifyLogo from "../assets/spotify/Icon.svg"
import SoundCloudLogo from "../assets/soundcloud/Icon.svg"
import SpotifyAuth from "../services/spotifyAuth"
import SoundCloudAuth from "../services/soundcloudAuth"
import { signInUser } from "../services/api"


const SignInCard: React.FC = (): JSX.Element => {

    interface errors {
        email?: string, 
        password?: string, 
    }

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<errors>({});
    const navigate = useNavigate();

    {/* 
        TODO:
            Insert Logo 
    */}


    const validateForm = () : boolean => {
        const newErrors: errors = {};
        const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!email) {
            newErrors.email = "An email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email address.";
        }

        if (!password) {
            newErrors.password = "A password is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }
        try {
            await signInUser(email,password)
            navigate('/home');
        } catch (error: any) {
            if (error.status === 401){
                setErrors({password:'Email or password is incorrect'})
            } else {
                console.error("Error during sign-in:", error);
            }
        }
    }

    return (
        <div className=" bg-gray-100 flex flex-col flex-grow h-full justify-center items-center">
            <div className="flex flex-col justify-center items-center mb-5">
                <img src="" alt="Place Logo Here" className="w-16 h-16 md:w-20 md:h-20"/>
                <div className="font-bold text-xl md:text-2xl text-center">Sign In Your Account</div>
            </div>
            <div className="bg-neutral flex flex-col p-6 sm:px-8 w-11/12 sm:w-3/4 md:w-2/4 lg:w-2/6 shadow-md rounded gap-5">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm ">Email Address</label>
                            <input type='text' onChange={(e) => setEmail(e.target.value)} id="email-input" autoComplete="off" className="border border-gray-300 rounded p-1 focus:outline-primary"></input>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm">Password</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} id="password-input" autoComplete="new-password" className="border border-gray-300 rounded p-1"></input>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                        </div>
                        
                        <div className="flex justify-center">
                            <button type="submit" className="border rounded bg-primary text-neutral hover:bg-gray-600 w-full py-2 text-sm">Sign In</button>
                        </div>
                    </div>    
                    </form>
                <div className="flex gap-3 justify-center items-center">
                    <hr className="w-1/5"></hr>
                    <div className="text-sm">Or Continue with</div>
                    <hr className="w-1/5"></hr>
                </div>
                <div className="flex justify-center items-center w-full gap-5">
                    <button  onClick={SpotifyAuth} className="flex justify-center items-center border py-2 w-2/5 shadow gap-2 hover:bg-gray-100">
                        <img src={SpotifyLogo} alt="Spotify Logo" className="w-6 h-6" />
                        <span className="text-sm">Spotify</span>
                    </button>
                    <button onClick={SoundCloudAuth} className="flex justify-center items-center border py-2 w-2/5 shadow gap-2 hover:bg-gray-100">
                        <img src={SoundCloudLogo} alt="SoundCloud Logo" className="w-6 h-6"/>
                        <span className="text-sm">SoundCloud</span>
                    </button>
                </div>
            </div>
            <span className="text-gray-500 text-sm text-center mt-2">Don't have an Account? <a href={`${import.meta.env.VITE_BASE_URL}/sign-up`} className="underline text-blue-700">Sign Up Here!</a></span>
        </div>
    )
}

export default SignInCard

