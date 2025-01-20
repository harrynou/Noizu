import { useAuth } from "../contexts/authContext";
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
        <nav className="bg-primary flex justify-between items-center text-white pr-3 pl-8 py-2 h-16">
            <div className="flex gap-20">
                <div className="font-bold">
                    Logo                                                    
                </div>
                <div>
                    <ul className="flex gap-16 flex-grow">
                        <li className="hover:text-accent">
                            <a href="/home">Home</a>
                        </li>
                        {isAuthenticated && 
                        <div>
                            <li className="hover:text-accent">
                                <a href="/favorites">Favorites</a>
                            </li>

                        </div>}
                        <li className="hover:text-accent">
                            <a href="/terms">Terms</a>
                        </li>
                        <li className="hover:text-accent">
                            <a href="/about-me">About Me</a>
                        </li>
                    </ul>
                </div>
            </div>
            {!isAuthenticated ? (
            <div className="account-buttons flex gap-4">
                <a href="/sign-up"><button className="button">Sign Up</button></a>
                <a href="/sign-in"><button className="button"><a href="/sign-in">Sign In</a></button></a>
            </div>
            ) : (
                <div className="relative w-10 h-10 mr-5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                </div>
                )}
        </nav>

    )
}


export default Navbar;