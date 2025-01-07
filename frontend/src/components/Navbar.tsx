
{/*
    TODO: Add Logo Brand left of navbar
    TODO: Conditional Rendering of Favorites, Playlists, etc... links oncelogged in
    TODO: Conditional Rendering of account avatar top right when logged in , Include Dropdown of Account Details, Logout
*/}

const Navbar: React.FC = (): JSX.Element => {
    return (
        <nav className="bg-primary flex justify-between items-center text-white pr-3 pl-8 py-2">
            <div className="flex gap-20">
                <div className="font-bold">
                    Logo                                                    
                </div>
                <div>
                    <ul className="flex gap-10 flex-grow">
                        <li className="hover:text-accent">
                            <a href="/home">Home</a>
                        </li>
                        <li className="hover:text-accent">
                            <a href="/terms">Terms</a>
                        </li>
                        <li className="hover:text-accent">
                            <a href="/about-me">About Me</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="account-buttons flex gap-4">
                <a href="/sign-up"><button className="button">Sign Up</button></a>
                <a href="/sign-in"><button className="button"><a href="/sign-in">Sign In</a></button></a>
            </div>
        </nav>

    )
}


export default Navbar;