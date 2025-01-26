import { useEffect, useState, useRef } from "react";
import {useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";


const NavDropdown: React.FC = ():JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown
    const options = ["Settings","Logout"]
    const navigate = useNavigate()
    const {logout} = useAuth()

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false); // Close dropdown if click is outside
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    const toggleDropdown = () => {
        setOpen(!open)
    }

    const handleOptionClick = (option: string) => {
        if (option === 'settings'){
            navigate('/settings')
        } else if (option === 'Logout'){
            logout()
            navigate('/sign-in')
        }
    }

    return (
        
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button 
                onClick={toggleDropdown} 
                className="text-white bg-black font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center" 
                type="button" 
                aria-haspopup="true" 
                aria-expanded={open}>
                    Account
                <svg 
                    className="w-2.5 h-2.5 ms-3" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none"
                    viewBox="0 0 10 6">
                    <path 
                        stroke="currentColor" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            {open && (
                <ul className="absolute bg-white rounded shadow mt-1 min-w-full text-sm">
                    {options.map((option) => (
                        <li 
                            key={option} 
                            onClick={() => handleOptionClick(option)} 
                            className="px-4 py-2 text-primary hover:bg-accent cursor-pointer">
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}



export default NavDropdown;