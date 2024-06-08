
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom';
import Statistics from './pages/personal/statistics';
import Login from './pages/auth/login';
import List from './pages/dashboard/list';
import MapPage from './pages/dashboard/mapPage';
import Home from './pages/dashboard/home';
import { UserContext } from "./context/userContext";
import { useState } from 'react';
import axios from 'axios';


interface User {
  email: string;
  profileImage: string;
  name: string;
  username: string;
  id: string;
}



function App() {

  const [user, setUser] = useState<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || "") : '');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') ? localStorage.getItem('token') : null);

  const updateUserData = (userInfo: any) => {
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const updateToken = (tokenValue: string) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
  }

  const logout = () => {
    try {
      axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`)
        .then(response => {
          if (response.status === 201) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        })
    }
    catch (error) {
      console.error('Logout Failed:', error);
    }
  };

  return (
    <>
      <UserContext.Provider value={{
        user,
        setUser: updateUserData,
        token,
        setToken: updateToken,
        logout
      } as any}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/statistics' element={<Statistics />} />
          <Route path='/home' element={<Home />} />
          <Route path="/list" element={<Navigate replace to="/list/1" />} />
          <Route path='/list/:page' element={<List />} />
          <Route path='/map' element={<MapPage />} />

        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
