import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Navbar from './components/navbar/Navbar.tsx';
import HomePage from './pages/home.tsx';
import AboutMePage from './pages/about-me.tsx'
import TermsPage from './pages/terms.tsx'
import SignInPage from './pages/sign-in.tsx';
import SignUpPage from './pages/sign-up.tsx';
import FavoritesPage from './pages/favorites.tsx'
import PlaylistsPage from './pages/playlists.tsx'
import { AuthContextWrapper, useAuth} from './contexts/authContext.tsx';
import PublicRoute from './components/wrappers/PublicRoute.tsx';
import SetUpAccount from './pages/set-up-account.tsx';
import NoPasswordRoute from './components/wrappers/NoPasswordRoute.tsx';
import AccountSettingsPage from './pages/account-settings.tsx';
import ProtectedRoute from './components/wrappers/ProtectedRoute.tsx';
import { MusicPlayerProvider } from './contexts/musicPlayerContext.tsx';
import PlaybackControls from './components/playback/PlaybackControls.tsx';
import QueueManager from './components/playback/QueueManager.tsx';

const AppRoutes = () => {
  const { isAuthenticated, hasPassword, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
        if (isAuthenticated && !hasPassword) {
            navigate('/setup-account');
        }
    }
  }, [isAuthenticated, hasPassword, loading, navigate]);
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/home"/>}></Route>
      <Route path='/home' element={<HomePage/>}></Route>
      <Route path='/sign-up' element={<PublicRoute><SignUpPage/></PublicRoute>}></Route>
      <Route path='/sign-in' element={<PublicRoute><SignInPage/></PublicRoute>}></Route>
      <Route path='/terms' element={<TermsPage/>}></Route>
      <Route path='/about-me' element={<AboutMePage/>}></Route>
      <Route path='/favorites' element={<ProtectedRoute><FavoritesPage/></ProtectedRoute>}></Route>
      <Route path='/playlists' element={<ProtectedRoute><PlaylistsPage/></ProtectedRoute>}></Route>
      <Route path='/setup-account' element={<NoPasswordRoute><SetUpAccount/></NoPasswordRoute>}></Route>
      <Route path='/account-settings' element={<AccountSettingsPage/>}></Route>
    </Routes>
  )
}


const App: React.FC = (): JSX.Element => {
  return (
    <Router>
      <div className='flex flex-col h-screen'>
        <AuthContextWrapper>
          <MusicPlayerProvider>
            <Navbar/>
            <QueueManager/>
            <AppRoutes/>
            <PlaybackControls/>
          </MusicPlayerProvider>
        </AuthContextWrapper>
      </div>
    </Router>
  )
}

export default App;
