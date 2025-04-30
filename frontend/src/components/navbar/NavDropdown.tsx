import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

interface NavOption {
    label: string;
    value: string;
    icon: JSX.Element;
}

const NavDropdown = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Define navigation options with icons
    const options: NavOption[] = [
        {
            label: "Account Settings",
            value: "settings",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            )
        },
        {
            label: "Your Favorites",
            value: "favorites",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            )
        },
        {
            label: "Your Playlists",
            value: "playlists",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            )
        },
        {
            label: "Logout",
            value: "logout",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            )
        }
    ];

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const handleOptionClick = (option: NavOption) => {
        setOpen(false);
        
        switch (option.value) {
            case "settings":
                navigate("/account-settings");
                break;
            case "favorites":
                navigate("/favorites");
                break;
            case "playlists":
                navigate("/playlists");
                break;
            case "logout":
                logout();
                navigate("/sign-in");
                break;
            default:
                break;
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button 
                onClick={toggleDropdown} 
                className="flex items-center space-x-2 focus:outline-none" 
                type="button" 
                aria-haspopup="true" 
                aria-expanded={open}
            >
                {/* User avatar */}
                <div className="w-8 h-8 bg-accentPrimary rounded-full flex items-center justify-center text-white font-medium">
                    U
                </div>
                
                {/* Dropdown arrow */}
                <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            
            {/* Dropdown menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
                    <div className="py-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                                className="w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-150"
                            >
                                <span className="text-gray-400">{option.icon}</span>
                                <span className="text-white">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavDropdown;