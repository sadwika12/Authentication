

import {useContext,React} from 'react'
import  {AppContext}  from '../context/appcontext'
const Header = () => {
  const {userdata, isloading}=useContext(AppContext) 

  if (isloading) { 
    return <div className='text-center mt-20'>Loading authentication status...</div>;
  }
  
  return (
    <div className='flex flex-col items-center text-center mt-20 px-4 '>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey!{userdata ?userdata.name:'developer'}</h1> 
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h2>
      <p className='mb-8 max-w-md'>This is a user authentication app built with React for the frontend and Node.js for the backend.
         It provides features such as user registration, login, email verification, and password reset functionality.
      </p>
      <button className='border-2 border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all font-semibold'>Get Started</button>
    </div>
  )
}

export default Header