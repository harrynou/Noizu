import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';

const App: React.FC = (): JSX.Element => {
  return (

    <Router>
      <Navbar/>
      <Routes>
        <Route></Route>
      </Routes>
    </Router>
  )
}

export default App
