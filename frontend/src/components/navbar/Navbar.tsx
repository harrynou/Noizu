import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext";
import NavDropdown from "./NavDropdown";

// Link component for desktop navigation
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium ${
        isActive
          ? 'text-white border-b-2 border-accent'
          : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-accent'
      } transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

// Link component for mobile navigation
const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar: React.FC = (): JSX.Element => {
    const { isAuthenticated, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    
    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    if (loading) {
        return (
            <nav className="bg-primary flex justify-between items-center text-white px-4 md:px-8 py-2 h-16">
                <div className="flex items-center gap-8">
                    <div className="font-bold text-lg">Noizu</div>
                </div>
                <div className="animate-pulse bg-gray-700 h-6 w-20 rounded"></div>
            </nav>
        );
    }

    return (
        <nav className="bg-primary shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo and brand name */}
                        <Link to="/" className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                                        <path d="M9 18V5l12-2v13"></path>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <circle cx="18" cy="16" r="3"></circle>
                                    </svg>
                                </div>
                                <span className="font-bold text-xl text-white tracking-tight">Noizu</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-12 md:flex md:space-x-8">
                            <NavLink to="/home">Home</NavLink>
                            
                            {isAuthenticated && (
                                <>
                                    <NavLink to="/favorites">Favorites</NavLink>
                                    <NavLink to="/playlists">Playlists</NavLink>
                                </>
                            )}
                            
                            <NavLink to="/about-me">About</NavLink>
                            <NavLink to="/terms">Terms</NavLink>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/sign-in" className="text-white hover:text-accent transition-colors duration-200">
                                    Sign In
                                </Link>
                                <Link to="/sign-up" className="px-4 py-2 rounded-full bg-accent text-white hover:bg-opacity-90 transition-colors duration-200">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <NavDropdown />
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-900`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <MobileNavLink to="/home">Home</MobileNavLink>
                    
                    {isAuthenticated && (
                        <>
                            <MobileNavLink to="/favorites">Favorites</MobileNavLink>
                            <MobileNavLink to="/playlists">Playlists</MobileNavLink>
                        </>
                    )}
                    
                    <MobileNavLink to="/about-me">About</MobileNavLink>
                    <MobileNavLink to="/terms">Terms</MobileNavLink>
                </div>
                
                {/* Mobile auth buttons */}
                <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center justify-around px-5">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/sign-in" className="block px-4 py-2 text-base font-medium text-white hover:text-accent transition-colors duration-200">
                                    Sign In
                                </Link>
                                <Link to="/sign-up" className="block px-4 py-2 rounded-full bg-accent text-white hover:bg-opacity-90 transition-colors duration-200">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="w-full">
                                <NavDropdown />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;