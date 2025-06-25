import React, { useState, useRef, useContext } from 'react';
import { MailIcon, LockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContent } from '../context/AppContext';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendurl } = useContext(AppContent);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const inputsRef = useRef([]);

  // Step 1: Send OTP to email
  const onSubmitHandler = async (e) => {
    e.preventDefault();
      if (!email || !email.includes('@')) {
    return toast.error('Please enter a valid email');
  }
    try {
  const { data } = await axios.post(`${backendurl}api/auth/resetotp`, { email });

  toast.success(data.message); // This now says: "If this email is registered..."
  setStep('verify');
} catch (err) {
  toast.error(err?.response?.data?.message || 'Something went wrong');
}

  };

  // Handle OTP input change
  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/\D/, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  // Step 2: Verify OTP and reset password
  const onVerifyHandler = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    if (finalOtp.length !== 6) return toast.error('Enter full 6-digit OTP');
    if (!newPassword) return toast.error('Please enter a new password');

    try {
      const { data } = await axios.post(`${backendurl}api/auth/resetpass`, {
        email,
        otp: finalOtp,
        newPassword,
      });

      if (data.message) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
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
        <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg w-[360px]">
          {step === 'request' ? (
            <form onSubmit={onSubmitHandler} className="flex flex-col items-center gap-4">
              <h1 className="text-2xl font-semibold text-center">Reset Password</h1>
              <p className="text-sm text-blue-300 text-center mb-4">
                Enter your registered email ID
              </p>
              <div className="relative w-full">
                <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-2 pl-10 pr-4 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-2 px-6 rounded-lg font-semibold"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={onVerifyHandler} className="flex flex-col items-center gap-4">
              <h1 className="text-xl font-semibold text-center">Enter OTP</h1>
              <p className="text-sm text-blue-300 text-center mb-4">
                A 6-digit OTP has been sent to your email
              </p>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    className="w-10 h-12 text-xl text-center rounded-md bg-blue-800 text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>

              <div className="relative w-full">
                <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full py-2 pl-10 pr-4 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-2 px-6 rounded-lg font-semibold"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
