import React from 'react';
import SpotifyIcon from '../assets/spotify/Icon.svg';
import SoundCloudIcon from '../assets/soundcloud/Icon.svg';

const AboutMePage: React.FC = (): JSX.Element => {
    // Define team members
    const teamMembers = [
        {
            name: 'Your Name',
            role: 'Lead Developer',
            avatar: 'https://via.placeholder.com/150',
            bio: 'Full-stack developer with a passion for music and web technologies.'
        }
        // Add more team members if needed
    ];

    // Tech stack used in the project
    const technologies = [
        { name: 'React', icon: '⚛️' },
        { name: 'TypeScript', icon: '🔷' },
        { name: 'TailwindCSS', icon: '🎨' },
        { name: 'Node.js', icon: '🟢' },
        { name: 'Express', icon: '🚂' },
        { name: 'MongoDB', icon: '🍃' }
    ];

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24">
            {/* Hero Section */}
            <section className="text-center mb-12 pt-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">About MeloSearch</h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    The ultimate platform to discover and enjoy music from multiple streaming services in one place.
                </p>
            </section>

            {/* Mission Statement */}
            <section className="mb-16">
                <div className="bg-gray-800 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-300 leading-relaxed">
                        MeloSearch was created with a simple goal: to unify the music streaming experience.
                        We believe that finding and enjoying music shouldn't be fragmented across multiple platforms.
                        Our application brings together content from Spotify and SoundCloud, allowing you to search,
                        discover, and create playlists that span across services, all in one seamless interface.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Unified Search</h3>
                        <p className="text-gray-400">
                            Search for your favorite music across multiple platforms with a single query and see results from Spotify and SoundCloud side by side.
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Cross-Platform Favorites</h3>
                        <p className="text-gray-400">
                            Save tracks from any platform to your favorites list and access them all in one centralized collection.
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <path d="M9 18V5l12-2v13"></path>
                                <circle cx="6" cy="18" r="3"></circle>
                                <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Integrated Playback</h3>
                        <p className="text-gray-400">
                            Enjoy seamless playback of tracks from different platforms without switching between apps.
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Custom Playlists</h3>
                        <p className="text-gray-400">
                            Create and manage playlists that can include tracks from both Spotify and SoundCloud.
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
                        <p className="text-gray-400">
                            Discover new music with intelligent recommendations based on your listening habits across platforms.
                        </p>
                    </div>
                </div>
            </section>

            {/* Supported Services */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Supported Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 flex items-center">
                        <img src={SpotifyIcon} alt="Spotify" className="w-16 h-16 mr-4" />
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Spotify</h3>
                            <p className="text-gray-400">
                                Access your Spotify library, playlists, and enjoy seamless playback with your premium account.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 flex items-center">
                        <img src={SoundCloudIcon} alt="SoundCloud" className="w-16 h-16 mr-4" />
                        <div>
                            <h3 className="text-lg font-semibold mb-1">SoundCloud</h3>
                            <p className="text-gray-400">
                                Discover independent artists and exclusive tracks from the SoundCloud community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center">
                            <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="w-24 h-24 rounded-full object-cover mb-4"
                            />
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <p className="text-accent mb-2">{member.role}</p>
                            <p className="text-gray-400">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Technologies Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Built With</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {technologies.map((tech, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
                                <span>{tech.icon}</span>
                                <span>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-300 mb-4">
                        Have questions, suggestions, or feedback? We'd love to hear from you!
                    </p>
                    <div className="flex gap-4">
                        <a 
                            href="mailto:contact@melosearch.com" 
                            className="px-4 py-2 bg-accent text-white rounded-md flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Email Us
                        </a>
                        <a 
                            href="https://github.com/hnou/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center gap-2 hover:bg-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            GitHub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutMePage;