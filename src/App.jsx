import './App.css';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import Navbar from './components/navbar/Navbar';
import LoginForm from './components/login/LoginForm';
import Courses from './pages/courses/Courses';
import Videos from './pages/videos/Videos';
import Students from './pages/students/Students';
import Users from './pages/users/Users';
import NotFound from './pages/NotFoundPage';
import Loader from './components/loader/Loader';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, severity: 'success', title: '', message: '' });
  const token = localStorage.getItem('token');
  const serverUrl = "http://localhost:8080";

  useEffect(() => {

    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const handleLogin = (credentials) => {
    setIsActionLoading(true);
    axios.post(`${serverUrl}/user/login`, {
      "username": credentials.username,
      "password": credentials.password
    })
      .then(function (response) {
        //console.log(response);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          saveUser(response.data.token);
          setIsLoggedIn(true);
          setIsActionLoading(false);
          location.replace("http://localhost:5173");
        }
      })
      .catch(function (error) {
        //console.log(error);
        showAlert('error', 'Invalid Credentials', 'The username or password is invalid.');
      });
  };

  const saveUser = (token) => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const user = decodedToken.sub;
        localStorage.setItem('user', user);
        console.log('User saved:', user);
        return user;
      } catch (error) {
        console.error("Invalid token", error);
        return null;
      }
    }
  }

  // alerts
  const showAlert = (severity, title, message) => {
    setAlert({ open: true, severity, title, message });
    // Auto-hide the alert after 3 seconds
    setTimeout(() => {
      setAlert(prev => ({ ...prev, open: false }));
    }, 3000);
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          {(isActionLoading) && (
            <div className="loader-container">
              <Loader />
            </div>
          )}
          <Routes>
            <Route path='/' element={<Courses />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/videos' element={<Videos />} />
            <Route path='/students' element={<Students />} />
            <Route path='/users' element={<Users />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Snackbar
            open={alert.open}
            autoHideDuration={3000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}
          >
            <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.message}
            </Alert>
          </Snackbar>
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

export default App;
