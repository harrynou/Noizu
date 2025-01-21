import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/home.tsx';
import AboutMe from './pages/about-me.tsx'
import Terms from './pages/terms.tsx'
import SignIn from './pages/sign-in.tsx';
import SignUp from './pages/sign-up.tsx';
import { AuthContextWrapper, useAuth} from './contexts/authContext.tsx';
import PublicRoute from './components/PublicRoute.tsx';
import SetUpPassword from './pages/set-up-password.tsx';
import NoPasswordRoute from './components/NoPasswordRoute.tsx';

const AppRoutes = () => {
  const { isAuthenticated, hasPassword, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
        if (isAuthenticated && !hasPassword) {
            navigate('/setup-password');
        }
    }
  }, [isAuthenticated, hasPassword, loading, navigate]);
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/home"/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/sign-up' element={<PublicRoute><SignUp/></PublicRoute>}></Route>
      <Route path='/sign-in' element={<PublicRoute><SignIn/></PublicRoute>}></Route>
      <Route path='/terms' element={<Terms/>}></Route>
      <Route path='/about-me' element={<AboutMe/>}></Route>
      <Route path='/setup-password' element={<NoPasswordRoute><SetUpPassword/></NoPasswordRoute>}></Route>
    </Routes>
  )
}


const App: React.FC = (): JSX.Element => {
  return (
    <Router>
      <div className='flex flex-col h-screen'>
        <AuthContextWrapper>
          <Navbar/>
          <AppRoutes/>
          </AuthContextWrapper>
      </div>
    </Router>
  )
}

export default App;
