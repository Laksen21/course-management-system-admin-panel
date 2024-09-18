import './App.css';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from "axios";

import Navbar from './components/navbar/Navbar'
import LoginForm from './components/login/LoginForm';
import Courses from './pages/courses/Courses';
import Videos from './pages/videos/Videos'
import Students from './pages/students/Students'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (credentials) => {
    axios.post('http://localhost:8080/user/login', {
      "username": credentials.username,
      "password": credentials.password
    })
      .then(function (response) {
        //console.log(response);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          setIsLoggedIn(true);
          location.replace("http://localhost:5173");
        }
      })
      .catch(function (error) {
        //console.log(error);
        alert('Invalid credentials');

      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Courses />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/videos' element={<Videos />} />
            <Route path='/students' element={<Students />} />
          </Routes>
        </BrowserRouter>

        {!isLoggedIn && (
          <div className="overlay">
            <LoginForm onLogin={handleLogin} />
          </div>
        )}
      </ThemeProvider>
    </>
  )
}

export default App
