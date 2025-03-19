import { useAuth } from "../../contexts/authContext";
import NavDropdown from "./NavDropdown";
import { Link } from 'react-router-dom';
{/*
    TODO: Add Logo Brand left of navbar
    TODO: Conditional Rendering of Favorites, Playlists, etc... links oncelogged in
    TODO: Conditional Rendering of account avatar top right when logged in , Include Dropdown of Account Details, Logout
*/}

const Navbar: React.FC = (): JSX.Element => {
    const {isAuthenticated, loading} = useAuth()
    if (loading){
        return <div>loading...</div>
    }
    return (
        <nav className="bg-primary flex justify-between items-center text-white px-4 md:px-8 py-2 h-16">
            <div className="flex items-center gap-8">
                <div className="font-bold text-lg">Logo</div>
                <div>
                    <ul className="hidden md:flex gap-16 text-base">
                        <li className="hover:text-accent">
                            <Link to="/home">Home</Link>
                        </li>
                        {isAuthenticated && 
                        <div className="flex gap-16">
                            <li className="hover:text-accent">
                                <Link to="/favorites">Favorites</Link>
                            </li>
                            <li className="hover:text-accent">
                                <Link to="/playlists">Playlists</Link>
                            </li>
                        </div>}
                        <li className="hover:text-accent">
                            <Link to="/terms">Terms & Conditions</Link>
                        </li>
                        <li className="hover:text-accent">
                            <Link to="/about-me">About Me</Link>
                        </li>
                    </ul>
                </div>
            </div>
            {!isAuthenticated ? (
            <div className="flex gap-4">
                <Link to="/sign-up"><button className="button">Sign Up</button></Link>
                <Link to="/sign-in"><button className="button">Sign In</button></Link>
            </div>
            ) : (
                <NavDropdown/>
                )}
        </nav>

    )
}


export default Navbar;