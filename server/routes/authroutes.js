import express from 'express'
import {otpverification,isauthenticated, login,logout,register,sendverifyotp,verifyemail,passwordresetotp,resetpassword,resetpasswordourself} from '../controllers/authcontroller.js'
import userauth from '../middleware/userauth.js'
import {getuserdata} from '../controllers/userverification.js'
const authrouter=express.Router();

authrouter.post('/register',register)  //completed

authrouter.post('/login',login) //completed

authrouter.post('/logout',logout)  //completed

authrouter.post('/send-verify-otp',userauth,sendverifyotp)  //completed

authrouter.post('/verify-account',userauth,verifyemail)

authrouter.get('/is-auth',userauth,isauthenticated)  //completed

authrouter.post('/sent-password-reset-otp',passwordresetotp)

authrouter.post('/password-reset',resetpassword)

authrouter.post('/reset-password-yourself',userauth,resetpasswordourself)

authrouter.post('/otp-verification',otpverification);

export default authrouter
