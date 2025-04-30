import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";


interface PublicRouteProp {
    children: JSX.Element;
    redirectTo?:string;
}

// Redirects users if they are accessing a page meant for non-Authenticated Users
const PublicRoute = ({children, redirectTo = '/home'}: PublicRouteProp) => {
    const {isAuthenticated, loading} = useAuth()
    if (loading){
        return <div>Loading...</div>; // TODO: Add Spinner
    }
    if (isAuthenticated) {
        return <Navigate to={redirectTo} />;
    }
    return children
}

export default PublicRoute