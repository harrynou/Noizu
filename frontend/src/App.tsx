import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/home.tsx';
import AboutMe from './pages/about-me.tsx'
import Terms from './pages/terms.tsx'
import SignIn from './pages/sign-in.tsx';
import SignUp from './pages/sign-up.tsx';
import { AuthContextWrapper } from './contexts/authContext.tsx';
import PublicRoute from './components/PublicRoute.tsx';

const App: React.FC = (): JSX.Element => {
  return (

    <Router>
      
      <div className='flex flex-col h-screen'>
        <AuthContextWrapper>
          <Navbar/>
          <Routes>
            <Route path='/' element={<Navigate to="/home"/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/sign-up' element={<PublicRoute><SignUp/></PublicRoute>}></Route>
            <Route path='/sign-in' element={<PublicRoute><SignIn/></PublicRoute>}></Route>
            <Route path='/terms' element={<Terms/>}></Route>
            <Route path='/about-me' element={<AboutMe/>}></Route>
          </Routes>
          </AuthContextWrapper>
      </div>
    </Router>
  )
}

export default App
