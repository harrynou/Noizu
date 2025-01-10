import React, { useState } from "react" 
import SpotifyLogo from "../assets/spotify/Icon.svg"
import SoundCloudLogo from "../assets/soundcloud/Icon.svg"

const SignUpCard: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [errors, setErrors] = useState<{email?: string, password?: string}>({});
    const [readOnly, setReadOnly] = useState<boolean>(true)

    {/* 
        TODO:
            Implement Validation for input
            Create hrefs for Auth to spotify and soundcloud
            Insert Logo 
        
    */}


    const validateForm = () : boolean => {
        return false

        
    }

    const handleSubmit = (e: React.FormEvent) : void => {
        console.log("Hello World");
        e.preventDefault
        if (validateForm()) {
            
        }
    }

    return (
        <div className=" bg-gray-100 flex flex-col flex-grow h-full justify-center items-center gap-5">
            <div className="flex flex-col justify-center items-center ">
                <img src="" alt="Place Logo Here" className="w-16 h-16 md:w-20 md:h-20"/>
                <div className="font-bold text-xl md:text-2xl text-center">Sign Up for an Account</div>
            </div>
            <div className="bg-neutral flex flex-col p-6 sm:px-8 w-11/12 sm:w-3/4 md:w-2/4 lg:w-2/6 shadow-md rounded gap-5">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm ">Email Address</label>
                            <input id="email" className="border border-gray-300 rounded p-1 focus:outline-primary"></input>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm">Password</label>
                            <input type="password" id="password" autoComplete="new-password" className="border border-gray-300 rounded p-1"></input>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="Confirm-password" className="text-sm">Confirm Password</label>
                            <input type='password' id="Confirm-password" autoComplete="new-password" className="border border-gray-300 rounded p-1"></input>
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
                    <a href="" className="flex justify-center items-center border py-2 w-2/5 shadow gap-2">
                        <img src={SpotifyLogo} alt="Spotify Logo" className="w-6 h-6" />
                        <span className="text-sm">Spotify</span>
                    </a>
                    <a href="" className="flex justify-center items-center border py-2 w-2/5 shadow gap-2">
                        <img src={SoundCloudLogo} alt="SoundCloud Logo" className="w-6 h-6"/>
                        <span className="text-sm">SoundCloud</span>
                    </a>
                </div>
            </div>
            <span className="text-gray-500 text-sm text-center">Already have an Account? <a href="http://localhost:5173/sign-in" className="underline text-blue-700">Log in Here!</a></span>
        </div>
    )
}

export default SignUpCard

