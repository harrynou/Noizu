
const Navbar: React.FC = (): JSX.Element => {
    return (
        <nav className="bg-primary flex justify-between items-center text-white pr-3 pl-8 py-2 h-full">
            <div className="flex gap-20">
                <div className="font-bold">
                    Logo                                                    {/* TODO: Add Logo  */}
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
                <button className="button">Sign Up</button>
                <button className="button">Sign In</button>
            </div>
        </nav>

    )
}


export default Navbar;