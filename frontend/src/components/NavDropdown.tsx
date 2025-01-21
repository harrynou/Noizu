import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";


const NavDropdown: React.FC = ():JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const options = ["Account Details","Logout"]
    const navigate = useNavigate()
    const {logout} = useAuth()

    const toggleDropdown = () => {
        setOpen(!open)
    }

    const handleOptionClick = (option: string) => {
        if (option === 'Account Details'){
            navigate('/account')
        } else if (option === 'Logout'){
            logout()
            navigate('/sign-in')
        }
    }

    return (
        
        <div className="relative inline-block text-left">
            <button onClick={toggleDropdown} className="text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button" aria-haspopup="true" aria-expanded={open}>Dropdown button
            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
            </button>
            {open && (
                <ul className="absolute bg-white rounded shadow mt-1">
                    {options.map((option) => (
                        <li key={option} onClick={() => handleOptionClick(option)} className="px-4 py-2 text-primary hover:bg-accent cursor-pointer text-sm">{option}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}



export default NavDropdown;