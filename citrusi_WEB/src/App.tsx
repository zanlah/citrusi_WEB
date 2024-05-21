
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Statistics from './pages/personal/statistics';
import Login from './pages/auth/login';

import MapPage from './pages/dashboard/mapPage';
import Home from './pages/dashboard/home';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='/map' element={<MapPage />} />

      </Routes>
    </>
  )
}

export default App
