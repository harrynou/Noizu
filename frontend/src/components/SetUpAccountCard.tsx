import { useState } from "react";
import { changePassword } from "../services/api.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/authContext.tsx';


interface errors{
    password?:string,
    confirmPassword?:string}

const SetUpAccountCard:React.FC = (): JSX.Element => {
    const [password, setPassword]  = useState<string>('')
    const [confirmPassword, setConfirmPassword]  = useState<string>('')
    const [errors,setErrors] = useState<errors>({});
    const navigate = useNavigate();
    const {Password} = useAuth();
    


    const validateForm = () => {
        const newErrors: errors = {};
        const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,32}$/;

        if (!password){
            newErrors.password = "A password is required."
        } else if (!passwordRegex.test(password)){
            newErrors.password = "Password must be 8-32 characters long, include at least one uppercase letter, one lowercase letter, and one number";
        }

        if (password !== confirmPassword){
            newErrors.confirmPassword = "Passwords do not match.";
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e:React.FormEvent): Promise<void> => {
        e.preventDefault()
        if (!validateForm()){
            return;
        }
        try {
            await changePassword(password);
            Password()
            navigate('/home');
        }catch (error) {
            console.error("Error during password setup:", error);
        }
    }


    return (
        <div className=" bg-gray-100 flex flex-col flex-grow h-full justify-center items-center">
            <div className="bg-neutral flex flex-col p-6 sm:px-8 w-11/12 sm:w-3/4 md:w-2/4 lg:w-2/6 shadow-md rounded gap-5">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex flex-col gap-6">
                        <span className="text-lg">You must setup a password before moving forward.</span>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm">
                                Password
                            </label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} id="password-input" autoComplete="new-password" className="border border-gray-300 rounded p-1">
                            </input>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirm-password" className="text-sm">
                                Confirm Password
                            </label>
                            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password-input" autoComplete="new-password" className="border border-gray-300 rounded p-1">
                            </input >
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <button type="submit" className="border rounded bg-primary text-neutral hover:bg-gray-600 w-full py-2 text-sm">Set Password</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default SetUpAccountCard;