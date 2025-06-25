import React, { useContext, useRef, useState } from 'react';
import { AppContent } from '../context/appcontext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Emailverify = () => {
  const navigate = useNavigate();
  const { backendurl, getUserData, setIsLoggedin } = useContext(AppContent);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  // Auto move to next input
 const handleChange = (element, index) => {
  const value = element.value.replace(/\D/, ''); // only digits
  let newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
    inputsRef.current[index + 1].focus();
  }
};


const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace') {
    let newOtp = [...otp];

    if (otp[index]) {
      // Clear current box
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (index > 0) {
      // Move back and clear previous box
      inputsRef.current[index - 1].focus();
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
      e.preventDefault(); // prevent default backspace navigation
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Enter full 6-digit OTP");
      return;
    }

    try {
      const { data } = await axios.post(`${backendurl}api/auth/verifyacc`, { otp: finalOtp }, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        await getUserData();
        setIsLoggedin(true);
        navigate('/');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
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
          <h2 className="text-2xl font-bold mb-3 text-center">Email Verification</h2>
          <p className="text-sm text-center text-gray-300 mb-4">
            Please enter the 6-digit OTP sent to your email
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className="w-10 h-12 text-xl text-center rounded-md bg-blue-800 text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-lg font-semibold"
            >
              Verify
            </button>

            <p className="text-sm mt-2 text-gray-300">
              Didn’t receive OTP?{" "}
              <span
                className="text-blue-400 underline cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login again
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Emailverify;
