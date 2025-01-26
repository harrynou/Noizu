import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/authContext";

interface ProtectedRouteProps {
    children: JSX.Element;
    redirectTo?: string;
}
// Redirects users if they are accessing a page meant for Authenticated Users
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, redirectTo = '/sign-in'}) => {
    const {isAuthenticated, loading} = useAuth()

    if (loading){
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} />;
    } else {
        return children
    }
}

export default ProtectedRoute;