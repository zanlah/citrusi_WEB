
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom';
import Statistics from './pages/personal/statistics';
import Login from './pages/auth/login';
import List from './pages/dashboard/list';
import MapPage from './pages/dashboard/mapPage';
import Home from './pages/dashboard/home';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='/home' element={<Home />} />
        <Route path="/list" element={<Navigate replace to="/list/1" />} />
        <Route path='/list/:page' element={<List />} />
        <Route path='/map' element={<MapPage />} />

      </Routes>
    </>
  )
}

export default App
