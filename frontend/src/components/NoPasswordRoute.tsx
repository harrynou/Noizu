import { useAuth } from "../contexts/authContext";
import { Navigate } from "react-router-dom";


interface NoPasswordRouteProp {
    children: JSX.Element;
    redirectTo?:string;
}

const NoPasswordRoute: React.FC<NoPasswordRouteProp> = ({children, redirectTo = '/home'}) => {
    const {isAuthenticated, loading, hasPassword} = useAuth()
    if (loading){
        return <div>Loading...</div>; // TODO: Add Spinner
    }
    if (isAuthenticated && hasPassword) {
        return <Navigate to={redirectTo} />;
    }
    return children
}

export default NoPasswordRoute