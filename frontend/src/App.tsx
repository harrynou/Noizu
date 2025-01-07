import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/home.tsx';
import AboutMe from './pages/about-me.tsx'
import Terms from './pages/terms.tsx'
import SignIn from './pages/Sign-In.tsx';
import SignUp from './pages/sign-up.tsx';

const App: React.FC = (): JSX.Element => {
  return (

    <Router>
      
      <div className='flex flex-col h-screen'>
        <Navbar/>
        <div className='flex-grow overflow-auto'>
          <Routes>
            <Route path='/' element={<Navigate to="/home"/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/sign-up' element={<SignUp/>}></Route>
            <Route path='/sign-in' element={<SignIn/>}></Route>
            <Route path='/terms' element={<Terms/>}></Route>
            <Route path='/about-me' element={<AboutMe/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
