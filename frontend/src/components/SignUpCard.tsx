import React, { useState } from "react" 
import SpotifyLogo from "../assets/spotify/Icon.svg"
import SoundCloudLogo from "../assets/soundcloud/Icon.svg"
import SpotifyAuth from "../services/spotifyAuth"
import SoundCloudAuth from "../services/soundcloudAuth"

const SignUpCard: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [errors, setErrors] = useState<{email?: string, password?: string}>({});
    const [readOnly, setReadOnly] = useState<boolean>(true)

    {/* 
        TODO:
            Implement Validation for input
            Insert Logo 
        
    */}


    const validateForm = () : boolean => {

        return true

        
    }

    const handleSubmit = (e: React.FormEvent) : void => {
        console.log("Hello World");
        e.preventDefault
        if (validateForm()) {
            
        }
    }

    return (
        <div className=" bg-gray-100 flex flex-col flex-grow h-full justify-center items-center">
            <div className="flex flex-col justify-center items-center mb-5">
                <img src="" alt="Place Logo Here" className="w-16 h-16 md:w-20 md:h-20"/>
                <div className="font-bold text-xl md:text-2xl text-center">Sign Up for an Account</div>
            </div>
            <div className="bg-neutral flex flex-col p-6 sm:px-8 w-11/12 sm:w-3/4 md:w-2/4 lg:w-2/6 shadow-md rounded gap-5">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm ">Email Address</label>
                            <input type='text' onChange={setEmail} id="email-input" autoComplete="off" className="border border-gray-300 rounded p-1 focus:outline-primary"></input>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm">Password</label>
                            <input type="text" id="password-input" autoComplete="new-password" className="border border-gray-300 rounded p-1"></input>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="Confirm-password" className="text-sm">Confirm Password</label>
                            <input type='text' id="confirm-password-input" autoComplete="new-password" className="border border-gray-300 rounded p-1"></input>
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="border rounded bg-primary text-neutral hover:bg-gray-600 w-full py-2 text-sm">Sign Up</button>
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
            <span className="text-gray-500 text-sm text-center mt-2">Already have an Account? <a href="http://localhost:5173/sign-in" className="underline text-blue-700">Sign in Here!</a></span>
        </div>
    )
}

export default SignUpCard

