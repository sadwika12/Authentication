import React from 'react'
import Navbar from '../components/navbar.jsx'
import Header from '../components/header.jsx'
const Home=()=>{
  return(
    <div className='flex flex-col items-center justify-center min-h-screen' style={{ backgroundColor: '#483D8B' }}>
      <Navbar />
      <Header />
    </div>
  )
}
export default Home;