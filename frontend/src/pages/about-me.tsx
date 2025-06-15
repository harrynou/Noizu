import SpotifyIcon from "../assets/spotify/Icon.svg";
import SoundCloudIcon from "../assets/soundcloud/Icon.svg";
import pfp from "../assets/aboutMe/pfp.jpg";
import reactLogo from "../assets/aboutMe/reactLogo.svg";
import tailwindLogo from "../assets/aboutMe/tailwindLogo.svg";
import tsLogo from "../assets/aboutMe/tsLogo.png";
import jsLogo from "../assets/aboutMe/jsLogo.svg";
import expressLogo from "../assets/aboutMe/expressLogo.svg";
import postgresSQLLogo from "../assets/aboutMe/postgresSQLLogo.svg";
import instagramLogo from "../assets/aboutMe/instagramLogo.png";
import githubLogo from "../assets/aboutMe/githubLogo.png";
import linkedinLogo from "../assets/aboutMe/linkedinLogo.png";
const AboutMePage = (): JSX.Element => {
  // About-Me Info
  const aboutMeInfo = {
    name: "Harrison Nou",
    role: "Sole Developer",
    avatar: pfp,
    bio: "Full-stack developer with a passion for music and web technologies.",
  };

  // Tech stack used in the project
  const technologies = [
    { name: "React", icon: reactLogo },
    { name: "TypeScript", icon: tsLogo },
    { name: "TailwindCSS", icon: tailwindLogo },
    { name: "Node.js", icon: jsLogo },
    { name: "Express", icon: expressLogo },
    { name: "PostgresSQL", icon: postgresSQLLogo },
  ];

  return (
    <div className="text-textPrimary container mx-auto p-4 md:p-6 pb-24">
      {/* Hero Section */}
      <section className="text-center mb-12 pt-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Noizu</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A unified platform designed to help you discover and enjoy music from multiple streaming services
        </p>
      </section>

      {/* Mission Statement */}
      <section className="mb-16">
        <div className="bg-gray-800 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">How Noizu Started</h2>
          <p className="text-gray-300 leading-relaxed">
            I created Noizu out of a recurring frustration in my music listening experience. Many of my favorite artists
            release certain tracks exclusively on Spotify while putting their remixes or collaborations only on
            SoundCloud. I wanted one place where I could search, queue up tracks, and build playlists across both
            platforms without having to limit myself to one. Just something I made because I was tired of the back and
            forth.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="w-12 h-12 bg-accentPrimary/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accentPrimary">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Unified Search</h3>
            <p className="text-gray-400">
              Search for your favorite music across multiple platforms with a single query and see results from Spotify
              and SoundCloud side by side.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="w-12 h-12 bg-accentPrimary/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accentPrimary">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cross-Platform Favorites</h3>
            <p className="text-gray-400">
              Save tracks from any platform to your favorites list and access them all in one centralized collection.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="w-12 h-12 bg-accentPrimary/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accentPrimary">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Integrated Playback</h3>
            <p className="text-gray-400">
              Enjoy playback of tracks from different platforms without switching between apps.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="w-12 h-12 bg-accentPrimary/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accentPrimary">
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

          {/* <div className="bg-gray-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-accentPrimary/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accentPrimary">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2"></h3>
                        <p className="text-gray-400">
                            
                        </p>
                    </div> */}
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
                Access your Spotify library, playlists, and enjoy playback with your premium account.
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

      {/* Me Section */}
      <section className="mb-16 ">
        <h2 className="text-2xl font-bold mb-6">Meet Me</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="relative bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 overflow-hidden rounded-full">
              <img
                src={aboutMeInfo.avatar}
                alt={aboutMeInfo.name}
                className="absolute -left-3 object-cover scale-150 mb-4 w-full h-full"
              />
            </div>
            <h3 className="text-lg font-semibold">{aboutMeInfo.name}</h3>
            <p className="text-accentPrimary mb-2">{aboutMeInfo.role}</p>
            <p className="text-gray-400">{aboutMeInfo.bio}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <a
              className="bg-gray-800 rounded-lg p-2"
              href="https://www.instagram.com/harry.noudles/"
              target="_blank"
              rel="noopener noreferrer">
              <img className="w-8" src={instagramLogo} alt="Instagram" />
            </a>
            <a
              className="bg-gray-800 rounded-lg p-2"
              href="https://github.com/harrynou/"
              target="_blank"
              rel="noopener noreferrer">
              <img className="w-8" src={githubLogo} alt="Github" />
            </a>
            <a
              className="bg-gray-800 rounded-lg p-2"
              href="https://www.linkedin.com/in/harrison-nou/"
              target="_blank"
              rel="noopener noreferrer">
              <img className="w-8" src={linkedinLogo} alt="Linkedin" />
            </a>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Built With</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {technologies.map((tech, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
                <img className="w-6" src={tech.icon} />
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
          <p className="text-gray-300 mb-4">Have questions, suggestions, or feedback?</p>
          <div className="flex gap-4">
            <a
              href="mailto:mail@noizu.com"
              className="px-4 py-2 bg-accentPrimary text-white rounded-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Me
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMePage;
