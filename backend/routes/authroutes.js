import express from 'express';
import { register, login, logout, sendverifyotp, verifyemail, isAuthenticated, resetpassword, sendresetotp } from '../controllers/authcontroller.js';
import userAuth from '../middleware/userAuth.js';
const authrouter =express.Router()
authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.post('/logout', logout);
authrouter.post('/verifyotp',userAuth,sendverifyotp);
authrouter.post('/verifyacc',userAuth,verifyemail);
authrouter.post('/isauth',userAuth,isAuthenticated);
authrouter.post('/resetotp',sendresetotp);
authrouter.post('/resetpass',resetpassword);


export default authrouter;