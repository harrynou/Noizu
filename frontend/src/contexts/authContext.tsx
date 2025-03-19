import {createContext, useContext, useState, useEffect, useMemo} from "react";
import { checkAuth, logoutUser, getAccessToken } from "../services/api";

interface userType {
    volume:number,

}

interface authContextType {
    isAuthenticated:boolean;
    hasPassword:boolean;
    user: userType | null;
    loading:boolean;
    hasSpotifyPremium: boolean;
    spotifyToken: string | null;
    login: (userData:userType, userHasPassword:boolean) => void;
    logout: () => void;
    Password: () => void;
    getAuth: () => void;
    getSpotifyToken: () => Promise<string>;
}

const authContext = createContext<authContextType>({
    isAuthenticated: false,
    hasPassword:false,
    user: null,
    loading: true,
    hasSpotifyPremium: false,
    spotifyToken: null,
    login: () => {},
    logout: () => {},
    Password: () => {},
    getAuth: () => {},
    getSpotifyToken: async () => '',
})

export const AuthContextProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasPassword, setHasPassword] = useState(false);
    const [user, setUser] = useState<userType | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasSpotifyPremium, setHasSpotifyPremium] = useState<boolean>(false);
    const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
    const [tokenExpirationTime, setTokenExpirationTime] = useState<number | null>(null);

    const getAuth = async () => {
        try{
            const data = await checkAuth()
            setIsAuthenticated(data.isAuthenticated);
            setHasPassword(data.userHasPassword);
            setHasSpotifyPremium(data.userHasSpotifyPremium);
            setUser(data.userInfo);
        }catch(error){
            setHasPassword(false);
            setIsAuthenticated(false);
            setHasSpotifyPremium(false);
            setUser(null);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        getAuth();
    },[]);

    const login = (userData: any, userHasPassword: boolean) => {
        setIsAuthenticated(true);
        setHasPassword(userHasPassword);
        setUser(userData);  
    }
    const logout = () => {
        setIsAuthenticated(false);
        setHasPassword(false);
        setUser(null);
        logoutUser()
    };

    const Password = () => {
        setHasPassword(true);
    }

    const getSpotifyToken = async (): Promise<string> => {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (spotifyToken && tokenExpirationTime && currentTime < tokenExpirationTime) {
            console.log('Using cached Spotify token');
            return spotifyToken;
        }

        console.log('Fetching a new Spotify token');
        const token = await getAccessToken('spotify');
        setSpotifyToken(token);
        setTokenExpirationTime(currentTime + 3600);  // Set expiration time
        return token;
    };
    const authContextValue = useMemo(
        () => ({
            isAuthenticated,
            hasPassword,
            hasSpotifyPremium,
            user,
            spotifyToken,
            loading,
            login,
            logout,
            Password,
            getAuth,
            getSpotifyToken,
        }),
        [isAuthenticated, hasPassword, hasSpotifyPremium, user, spotifyToken, loading]
    );
    

    return <authContext.Provider value={authContextValue}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);