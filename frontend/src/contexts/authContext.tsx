import {createContext, useContext, useState, useEffect} from "react";
import
interface userType {
    user_id:number,
    email:string,
}

interface authContextType {
    isAuthenticated:boolean;
    user: userType | null;
    loading:boolean;
    login: (userData:any) => void
    logout: () => void  
}

const authContext = createContext<authContextType>({
    isAuthenticated = false,
    user = null,
    loading = true,
    login: () => {},
    logout: () => {}
})

export const authContextWrapper: React.FC = ():JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAuth = async () => {
            try{

            }catch(error){

            }
        }
    })

    const login = (userData: any) => {
        setIsAuthenticated(true);
        setUser(userData);
    }
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };
    return (

    )
}