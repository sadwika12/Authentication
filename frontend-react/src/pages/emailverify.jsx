import React from 'react'
import {AppContext} from '../context/appcontext'
import {useContext} from 'react'
import axios from 'axios'
import {useRef,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
const Emailverify=()=>{
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const {backendurl,isloggedin,userdata,getuserdata}=useContext(AppContext);
  const navigate=useNavigate();

  const handleChange = (value, index) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.charAt(0); 
    setOtp(newOtp);
    if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
    }
  };
  const handlekeydown=(e,index)=>{
    if(e.key === 'Backspace' && !otp[index] && index > 0 ){ 
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp); 
        inputRefs.current[index - 1].focus();
    }
  }
  const handlepaste = (e) => {
    e.preventDefault(); 
    const paste = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = paste.padEnd(6, '').split('').slice(0, 6);
    setOtp(newOtp);
    const lastIndex = Math.min(paste.length, 6) - 1;
    if (lastIndex >= 0 && lastIndex < 5 && inputRefs.current[lastIndex + 1]) {
        inputRefs.current[lastIndex + 1].focus();
    } else if (inputRefs.current[5]) {
        inputRefs.current[5].focus(); 
    }
  };

  
  


  const onsubmithandler=async(e)=>{
  try{
    e.preventDefault();
    const otpArray = inputRefs.current.map(input => input.value);
    const finalOtp = otpArray.join(''); 
    if (finalOtp.length !== 6) {
        alert('Please enter the complete 6-digit OTP.');
        return; 
    }
    const {data}=await axios.post(`${backendurl}/api/auth/verify-account`,{otp: finalOtp});
    if(data.sucess){
      await getuserdata();
      alert('Email verified successfully');
      navigate('/');
    } else {
      console.log(data.message);
    }
  }catch(error){
    console.log("Error occured during email verification",error);
    const errorMessage = error.response?.data?.message || error.message;
    console.log("Backend Response Message:", errorMessage); 
    alert(`Verification failed: ${errorMessage}`);
  }
}
useEffect(()=>{
    isloggedin && userdata && userdata.isVerified && navigate('/')
},[isloggedin,userdata])
  return(
    <div className='flex items-center justify-center min-h-screen px-6
        sm:px-0 bg-gradient-to-br from-blue-150 to-blue-900'>
          <div  className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indido-300 text-sm'>
            <form onSubmit={onsubmithandler} >
              <h2 className='text-3xl font-bold text-center text-gray-300 mb-4'>Email Verification</h2>
              <p className='text-center mb-4 text-gray-500'>
                A verification OTP has been sent to your registered email address. Please check your inbox and enter the OTP to verify your email.
              </p>
              <div className='mb-8 flex justify-between' onPaste={handlepaste}>
                {Array.from({length:6}).map((_, index) => (
                  <input 
                    key={index}
                    type="text"
                    maxLength="1"
                    required
                    className='bg-[#333A5C]  w-12 h-12 text-center text-white text-xl rounded-md'
                    ref={e=>inputRefs.current[index]=e}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e)=>handlekeydown(e,index)}

                  />
                ))}
              </div>
              <button className='w-full bg-blue-600 hover:bg-blue-700 text-white 
              font-semibold py-2.5 rounded-full transition-all cursor-pointer'>Verify Email</button>
            </form>
          </div>
      
    </div>
  )
}
export default Emailverify;