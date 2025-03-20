import { useState } from "react";
import { setUpAccount } from "../../services/api.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/authContext.tsx';


interface errors{
    email?:string,
    password?:string,
    confirmPassword?:string}

const SetUpAccountCard:React.FC = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword]  = useState<string>('');
    const [errors,setErrors] = useState<errors>({});
    const navigate = useNavigate();
    const {Password} = useAuth();
    


    const validateForm = () => {
        const newErrors: errors = {};
        const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,32}$/;

        if (!email){
            newErrors.email = "An email is required.";
        } else if (!emailRegex.test(email)){
            newErrors.email = "Invalid email address.";
        }

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
            await setUpAccount(email, password);
            Password()
            navigate('/home');
        }catch (error:any) {
            if (error.error === "Email Already in Use."){
                setErrors({email:'Email is already in use.'})
            } else {
            console.error("Error during password setup:", error);
            }
        }
    }


    return (
        <div className="flex flex-col flex-grow h-full justify-center items-center">
            <div className="bg-secondary text-textSecondary flex flex-col p-6 sm:px-8 w-11/12 sm:w-3/4 md:w-2/4 lg:w-2/6 shadow-md rounded gap-5">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex flex-col gap-6">
                        <span className="text-lg">You must setup an email and password for your account before continuing.</span>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm">
                                Email
                            </label>
                            <input type='email' onChange={(e) => setEmail(e.target.value)} id="email-input" autoComplete="new-email" className="border border-gray-300 rounded p-1">
                            </input>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>
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
                            <button type="submit" className="border rounded bg-primary text-textPrimary hover:bg-gray-600 w-full py-2 text-sm">Set Password</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default SetUpAccountCard;