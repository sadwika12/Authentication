

import {React,useContext} from 'react'
import react from '../assets/react.svg'
import { useNavigate } from 'react-router-dom'
import {AppContext} from '../context/appcontext'
import axios from 'axios'
const Navbar=()=>{
  const navigate=useNavigate();
  const {userdata,backendurl,setuserdata,setisloggedin,isloading}=useContext(AppContext); 
  
  if (isloading) { 
    return null; 
  }
  const sendverificationotp=async()=>{
    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(`${backendurl}/api/auth/send-verify-otp`);
      if(data.sucess){
        alert('Verification OTP sent to your email')
        navigate('/email-verify');
      }
      else{
        console.log(data.message)
      }
    }catch(error){
      console.log("Error occured during sending verification otp",error);
    }
  }
  const logoutHandler=async()=>{
    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(`${backendurl}/api/auth/logout`);
      console.log(data);
      if(data.sucess){
        setuserdata(false);
        setisloggedin(false);
        navigate('/');
      }

    }catch(error){
      console.log("Error occured during logout",error);
    }
  }
  return(
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 h-24'>
      <img src={react} alt="" className='w-auto h-12'/>
      {userdata ?<div className='flex justify-center px-5 py-2 gap-2 border-2 border-gray-500 h-12 w-12 rounded-full 
                  text-gray-800 cursor-pointer hover:bg-gray-100 transition-all font-bold relative group'>
                  {userdata.name[0].toUpperCase()}
                  <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                    <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                      <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Profile</li>
                      {!userdata.isVerified && <li onClick={sendverificationotp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Email</li> }
                      <li onClick={logoutHandler} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
                    </ul>
                  </div>
                </div>:
      <button 
        className='flex items-center gap-2 border-2 border-gray-500 rounded-full px-6 py-2 
                  text-gray-800 hover:bg-gray-100 transition-all font-semibold'
        onClick={()=>navigate('/login')}>
        Login
      </button>}
    </div>
  )
}
export default Navbar;