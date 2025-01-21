import {createContext, useContext, useState, useEffect} from "react";
import { checkAuth, logoutUser } from "../services/api";

interface userType {
    user_id:number,
    email:string,
}

interface authContextType {
    isAuthenticated:boolean;
    hasPassword:boolean
    user: userType | null;
    loading:boolean;
    login: (userData:userType) => void;
    logout: () => void;
    Password: () => void;

}

const authContext = createContext<authContextType>({
    isAuthenticated: false,
    hasPassword:false,
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
    Password: () => {}
})

export const AuthContextWrapper: React.FC<{children:React.ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasPassword, setHasPassword] = useState(false);
    const [user, setUser] = useState<userType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAuth = async () => {
            try{
                const data = await checkAuth()
                setIsAuthenticated(data.isAuthenticated);
                setHasPassword(data.hasPassword);
                setUser(data.user);
            }catch(error){
                setHasPassword(false);
                setIsAuthenticated(false);
                setUser(null);
            }finally{
                setLoading(false)
            }
        };
        getAuth();
    },[]);

    const login = (userData: any) => {
        setIsAuthenticated(true);
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

    return (
        <authContext.Provider value={{ isAuthenticated, hasPassword, user, loading, login, logout, Password}}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);