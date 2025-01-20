import {createContext, useContext, useState, useEffect} from "react";
import { checkAuth } from "../services/api";

interface userType {
    user_id:number,
    email:string,
}

interface authContextType {
    isAuthenticated:boolean;
    user: userType | null;
    loading:boolean;
    login: (userData:userType) => void
    logout: () => void  
}

const authContext = createContext<authContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    login: () => {},
    logout: () => {}
})

export const AuthContextWrapper: React.FC<{children:React.ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAuth = async () => {
            try{
                const data = await checkAuth()
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user);
            }catch(error){
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
        setUser(null);
    };
    return (
        <authContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);