import { useAuth } from "../contexts/authContext";
import NavDropdown from "./NavDropdown";
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
                            <a href="/home">Home</a>
                        </li>
                        {isAuthenticated && 
                        <div className="flex gap-16">
                            <li className="hover:text-accent">
                                <a href="/favorites">Favorites</a>
                            </li>
                            <li className="hover:text-accent">
                                <a href="/playlists">Playlists</a>
                            </li>
                        </div>}
                        <li className="hover:text-accent">
                            <a href="/terms">Terms & Conditions</a>
                        </li>
                        <li className="hover:text-accent">
                            <a href="/about-me">About Me</a>
                        </li>
                    </ul>
                </div>
            </div>
            {!isAuthenticated ? (
            <div className="flex gap-4">
                <a href="/sign-up"><button className="button">Sign Up</button></a>
                <a href="/sign-in"><button className="button"><a href="/sign-in">Sign In</a></button></a>
            </div>
            ) : (
                <NavDropdown/>
                )}
        </nav>

    )
}


export default Navbar;