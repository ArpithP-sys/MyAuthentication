import React from 'react';
import './index.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Emailverify from './pages/Emailverify';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

import axios from 'axios';
axios.defaults.withCredentials = true;

const App = () => {
  const location = useLocation();
  const hidePadding = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <Navbar />
      <div className={`${hidePadding ? '' : 'pt-24'} min-h-screen`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<Emailverify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default App;
