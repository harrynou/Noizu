import { useAuth } from "../contexts/authContext";
import { Navigate } from "react-router-dom";


interface PublicRouteProp {
    children: JSX.Element;
    redirectTo?:string;
}

const PublicRoute: React.FC<PublicRouteProp> = ({children, redirectTo = '/home'}) => {
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