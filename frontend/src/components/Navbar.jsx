import React, { useState, useContext, useEffect, useRef } from 'react';
import { Globe, LogInIcon, LogOut, MailCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { userData, backendurl, setIsLoggedin, setUserData } = useContext(AppContent);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hideLoginButton = location.pathname === '/login' || location.pathname === '/signup';

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendurl}api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success(data.message || 'Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendverificationotp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendurl}api/auth/verifyotp`);
      if (data.message) {
        toast.success(data.message);
        navigate('/email-verify');
        setIsDropdownOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error sending OTP');
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between p-4 sm:p-6 bg-white shadow-md z-50">
      <div className="flex items-center space-x-2">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Globe size={28} strokeWidth={2.2} className="text-blue-600" />
          <h1 className="text-2xl font-bold font-mono text-blue-600">MyAuth</h1>
        </button>
      </div>

      {!hideLoginButton && (
        <div className="flex items-center gap-4 relative">
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg uppercase shadow cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-44 z-50">
                  {!userData?.isverified && (
                    <div
                      onClick={sendverificationotp}
                      className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-yellow-100 rounded-md cursor-pointer"
                    >
                      <MailCheck size={16} className="text-yellow-600" />
                      <span className="text-gray-700">Verify Email</span>
                    </div>
                  )}
                  <div
                    onClick={logout}
                    className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-red-100 rounded-md cursor-pointer"
                  >
                    <LogOut size={16} className="text-red-500" />
                    <span className="text-gray-700">Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Login
              <LogInIcon size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
