import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/home.tsx';
import AboutMe from './pages/about-me.tsx'
import Terms from './pages/terms.tsx'
const App: React.FC = (): JSX.Element => {
  return (

    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Navigate to="/home"/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/terms' element={<Terms/>}></Route>
        <Route path='/about-me' element={<AboutMe/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
