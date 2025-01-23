import {createContext, useContext, useState, useEffect} from "react";
import { checkAuth, logoutUser } from "../services/api";

interface userType {
    userId:number,
    email:string,
}

interface authContextType {
    isAuthenticated:boolean;
    hasPassword:boolean
    user: userType | null;
    loading:boolean;
    login: (userData:userType, userHasPassword:boolean) => void;
    logout: () => void;
    Password: () => void;
    getAuth: () => void;

}

const authContext = createContext<authContextType>({
    isAuthenticated: false,
    hasPassword:false,
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
    Password: () => {},
    getAuth: () => {}
})

export const AuthContextWrapper: React.FC<{children:React.ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasPassword, setHasPassword] = useState(false);
    const [user, setUser] = useState<userType | null>(null);
    const [loading, setLoading] = useState(true);

    const getAuth = async () => {
        try{
            const data = await checkAuth()
            setIsAuthenticated(data.isAuthenticated);
            setHasPassword(data.userHasPassword);
            setUser(data.user);
        }catch(error){
            setHasPassword(false);
            setIsAuthenticated(false);
            setUser(null);
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        getAuth();
    },[]);

    const login = (userData: any, userHasPassword: boolean) => {
        setIsAuthenticated(true);
        setHasPassword(userHasPassword)
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
        <authContext.Provider value={{ isAuthenticated, hasPassword, user, loading, login, logout, Password, getAuth}}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);