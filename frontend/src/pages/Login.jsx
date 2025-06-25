import React, { useContext, useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/appcontext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const {backendurl, setIsLoggedin,getUserData } = useContext(AppContent);
  const [state, setState] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      let res;

   if (state === 'signup') {
  res = await axios.post(`${backendurl}api/auth/register`, { name, email, password });
  if (res.data.success) {
    toast.success('Registered! Please login.');
    setState('login'); // switch to login
    return;
  }
} else {
        res = await axios.post(`${backendurl}api/auth/login`, { email, password });
      }

      const data = res.data;

    if (data.success) {
  setIsLoggedin(true);
  await getUserData(); // ✅ fetch user data after login
  toast.success(data.message || 'Success');
  navigate('/', { replace: true });
}
else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error during auth:', error);
      const errorMessage = error?.response?.data?.message || 'Internal server error';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        bg-[size:6rem_4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_1000px_at_90%_100%,#3B82F6,transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_900px_at_10%_100%,#3B82F6,transparent)]"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg w-[350px]">
          <h2 className="text-2xl font-bold mb-1 text-center">
            {state === 'signup' ? 'Create Account' : 'Login'}
          </h2>
          <p className="text-sm text-center text-gray-300 mb-6">
            {state === 'signup' ? 'Create your account' : 'Login to your account!'}
          </p>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            {state === 'signup' && (
              <div className="relative">
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  className="w-full py-2 pl-10 pr-4 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
              </div>
            )}

            <div className="relative">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email ID"
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
            </div>

            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
            </div>

            <div className="text-right text-sm">
              <p
                onClick={() => navigate('/reset-password')}
                className="text-blue-300 hover:underline cursor-pointer"
              >
                Forgot password?
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {state === 'signup' ? 'Sign Up' : 'Login'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-sm mt-4 text-gray-300">
            {state === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setState('login')}
                  className="text-blue-400 underline"
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <button
                  onClick={() => setState('signup')}
                  className="text-blue-400 underline"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
