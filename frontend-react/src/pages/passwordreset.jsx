import React from 'react'
import {useState,useEffect,useContext,useRef} from 'react'
import { AppContext } from '../context/appcontext';
import axios from 'axios'

import { useNavigate } from 'react-router-dom'; 

const Passwordreset=()=>{
  const [email,setEmail]=useState('');
  const [newpassword,setnewPassword]=useState('');
  const [isemailsent,setemailsent]=useState(false); 
 
  const [otp,setotp]=useState(Array(6).fill('')); 
  const [isotpsubmitted,setisotpsubmitted]=useState(false); 
  
  const {backendurl,userdata}=useContext(AppContext);
  const inputRefs=useRef([])

  const navigate = useNavigate();

 
  
  const handleChange = (value, index) => {
    
    if (value.length > 1) return; 
    const newOtp = [...otp];
    newOtp[index] = value; 
    setotp(newOtp);
    if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
    }
  };

  const handlekeydown=(e,index)=>{
    if(e.key === 'Backspace' && !otp[index] && index > 0 ){ 
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setotp(newOtp); 
        inputRefs.current[index - 1].focus();
    }
  }

  const handlepaste = (e) => {
    e.preventDefault(); 
    const paste = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = paste.padEnd(6, '').split('').slice(0, 6);
    setotp(newOtp);
    const lastIndex = Math.min(paste.length, 6) - 1;
    if (lastIndex >= 0 && inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
    }
  };

  const onsubmitemailhandler=async(e)=>{
    e.preventDefault();
    try{
        const {data}=await axios.post(`${backendurl}/api/auth/sent-password-reset-otp`,{email});
        if(data.sucess){
          alert('OTP sent to your email');
          setemailsent(true)
        } else {
          console.log(data.message);
          alert(data.message || 'Failed to send OTP.');
        }
    }catch(error){
      console.log("Error occur",error);
      alert(error.response?.data?.message || 'An error occurred while sending the OTP.');
    }
  }

  const onsubmitotp=async(e)=>{
    e.preventDefault();
    try{
      const otpArray = inputRefs.current.map(input => input.value);
      const finalOtp = otpArray.join(''); 
      const {data}=await axios.post(`${backendurl}/api/auth/otp-verification`,{
          email, 
          otp: finalOtp, 
      })
      console.log(data);
       if(data.sucess){
        alert('otp verified sucessfully')
        setisotpsubmitted(true);
      }else{
        alert('data.message');
      }
    }catch(error){
      console.log("error occured",error)
    }
  }

  const onsubmitnewpassword=async(e)=>{
    e.preventDefault();
    try{
      const {data}=await axios.post(`${backendurl}/api/auth/password-reset`,{
          email,  
          newpassword
      })

      console.log(data);
      
      if(data.sucess){
        alert('password is resetted sucessfully')
        navigate('/login') 
      }
      else {
        alert(data.message || 'Password reset failed.');
      }
    }catch(error){
        console.log("error required",error);
        alert(error.response?.data?.message || 'An error occurred during password reset.');
    }
  }
  
  return(
    <div className='flex items-center justify-center min-h-screen px-6
        sm:px-0 bg-gradient-to-br from-blue-150 to-blue-900'>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indido-300 text-sm'>
        {!isemailsent && 
          <form onSubmit={onsubmitemailhandler}>
            <h2 className='text-3xl font-bold text-center text-gray-300 mb-4'>Reset Password</h2>
            <p className='text-center mb-4 text-gray-500'>
              Enter your registered email address
            </p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <input onChange={e=>setEmail(e.target.value)} value={email} type="text" placeholder="Enter your Email" required className='bg-transparent outline-none'/>
            </div>
            <button type="submit" className='w-full bg-blue-600 hover:bg-blue-700 text-white 
              font-semibold py-2.5 rounded-full transition-all cursor-pointer'>
              Submit
            </button>
          </form>
        }
          
        
        {!isotpsubmitted && isemailsent &&
          <form onSubmit={onsubmitotp}>
            <h2 className='text-3xl font-bold text-center text-gray-300 mb-4'>Reset Pasword</h2>
            <p className='text-center mb-4 text-gray-500'>
              A verification OTP has been sent to your registered email address. Please check your inbox and enter the OTP to reset the password.
            </p>
            <div className='mb-8 flex justify-between' onPaste={handlepaste}>
              {Array.from({length:6}).map((_, index) => (
                <input 
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className='bg-[#333A5C] w-12 h-12 text-center text-white text-xl rounded-md'
                  ref={e=>inputRefs.current[index]=e}
                  value={otp[index]}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e)=>handlekeydown(e,index)}
                />
              ))}
            </div>
            <button type="submit" className='w-full bg-blue-600 hover:bg-blue-700 text-white 
            font-semibold py-2.5 rounded-full transition-all cursor-pointer'>Verify OTP</button>
          </form>
        }

        {isotpsubmitted && isemailsent && 
          <form onSubmit={onsubmitnewpassword}>
            <h2 className='text-3xl font-bold text-center text-gray-300 mb-4'>Reset Password</h2>
            <p className='text-center mb-4 text-gray-500'>
              Enter your new Paswword
            </p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <input onChange={(e)=>setnewPassword(e.target.value)} type="password" placeholder="Enter your new password" required className='bg-transparent outline-none'/>
            </div>
            <button type="submit" className='w-full bg-blue-600 hover:bg-blue-700 text-white 
              font-semibold py-2.5 rounded-full transition-all cursor-pointer'>
              Submit
            </button>
          </form>
        }
      </div>
    </div>
  )
}
export default Passwordreset;