import React,{useContext,useState} from 'react'
import react from '../assets/react.svg'
import {useNavigate} from 'react-router-dom'
import {AppContext}  from '../context/appcontext'
import axios from 'axios'
const Login=()=>{
  const {backendurl,setisloggedin,getuserdata}=useContext(AppContext);
  const [state,setState]=useState('sign up');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();
  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault();
      axios.defaults.withCredentials=true;
      if(state==='sign up'){
        const {data}=await axios.post(`${backendurl}/api/auth/register`,{
          name,email,password
        });
        if(data.success){
          setisloggedin(true);
          navigate('/');
        }
        else{
          console.log('error');
          alert(data.message);
        }
      }else{
        const {data}=await axios.post(`${backendurl}/api/auth/login`,{
          email,password
        });
        if(data.sucess){
          setisloggedin(true);
          navigate('/');
          await getuserdata();
        }
        else{
          alert(data.message);
        }
      }
    }
    catch(error){
      console.log("Error occured during authentication",error);
    }
  }
  return(
    <div className='flex items-center justify-center min-h-screen px-6
        sm:px-0 bg-gradient-to-br from-blue-150 to-blue-900'>
      <img onClick={()=>navigate('/')} src={react} className='absolute  w-10 h-10 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div>
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indido-300 text-sm'>
          <h2 className='text-3xl font-bold text-center text-gray-300'>{state==='sign up'? 'Create Account':'Login'}</h2>
          <p className='text-center mb-4 mt-2 text-gray-500'>
            {state==='sign up'? 'Create your account':'Login to your account'}
          </p>
          <form onSubmit={onSubmitHandler}>
            {state==='sign up' && (
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
              <input onChange={e=>setName(e.target.value)} value={name} type="ptext" placeholder="Enter your Name" required className='bg-transparent outline-none '/>
              </div>
            )}
            
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              {/*<img src={react} alt="person icon" className='w-10 h-10 mx-auto mb-4'/>*/}
              <input onChange={e=>setEmail(e.target.value)} value={email}  type="text" placeholder="Enter your Email" required className='bg-transparent outline-none'/>
            </div>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
              <input onChange={e=>setPassword(e.target.value)} value={password} type="password" placeholder="Enter your Password" required className='bg-transparent outline-none '/>
            </div>
            <p onClick={()=>navigate('/password-reset')} className='text-sm text-gray-500 mb-4 cursor-pointer'>Forgot your password?</p>
            <button type="submit" className='w-full bg-blue-600 hover:bg-blue-700 text-white 
              font-semibold py-2.5 rounded-full transition-all cursor-pointer'>
              {state==='sign up' ? 'Sign Up' : 'Login'}
            </button>
          </form>
          {state==='sign up' ? (
            <p className='text-sm text-center mt-3'>Already have an account?{''}
            <span onClick={()=>setState('Login')} className='text-blue-500 cursor-pointer underline'>Login Here</span>
            </p>
          ):(
            <p onClick={()=>setState('sign up')} className='text-sm text-center mt-3'>Don't have an account?{''}
            <span className='text-blue-500 cursor-pointer underline'>Sign Up</span>
            </p>
          )}
          
        </div>
      </div>
    </div>
  )
}
export default Login;