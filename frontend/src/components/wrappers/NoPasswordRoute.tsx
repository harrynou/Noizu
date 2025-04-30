import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";


interface NoPasswordRouteProp {
    children: JSX.Element;
    redirectTo?:string;
}
// Redirects users if they have not setup a password for their account
const NoPasswordRoute = ({children, redirectTo = '/home'}: NoPasswordRouteProp) => {
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