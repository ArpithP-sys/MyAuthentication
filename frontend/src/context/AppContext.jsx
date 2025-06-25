import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL.endsWith('/')
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL + '/';

  axios.defaults.withCredentials = true;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendurl}api/user/data`);
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      setUserData(null);
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.post(`${backendurl}api/auth/isauth`);
      if (data?.message === "User is authenticated") {
        setIsLoggedin(true);
        await getUserData(); // ✅ only after confirm auth
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      setUserData(null);
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AppContent.Provider
      value={{
        backendurl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        loading,
      }}
    >
      {children}
    </AppContent.Provider>
  );
};
