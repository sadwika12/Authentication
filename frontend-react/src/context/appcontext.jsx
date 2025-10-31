

import {useEffect,useState,createContext} from 'react'
import axios from  'axios'  
export const AppContext=createContext();

export const AppProvider=(props)=>{
  axios.defaults.withCredentials = true;
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  
  const [isloggedin,setisloggedin]=useState(null);
  const [userdata,setuserdata]=useState(null);
  const [isloading,setIsLoading]=useState(true); 

  const getauthstatus=async()=>{
    try{
      const {data}= await axios.get(`${backendurl}/api/auth/is-auth`);
      console.log(data)
      if(data.sucess){
        setisloggedin(true);
        await getuserdata(); 
      } else {
        setisloggedin(false);
      }
    }catch(error){
      console.log("Error occured while checking auth status",error);
      setisloggedin(false);
    } finally {
      setIsLoading(false); 
    }
  }

  const getuserdata=async()=>{
    try{
      const {data}= await axios.get(`${backendurl}/api/user/get-user-data`)
      console.log(data)
      data.success?setuserdata(data.data):setuserdata(null)
    }
    catch(error){
      console.log("Error occured while fetching user data",error);
      setuserdata(null);
    }
  }

  useEffect(()=>{
    getauthstatus();
  },[])

  const value={
    backendurl,
    isloggedin,setisloggedin
    ,userdata,setuserdata,
    getuserdata,
    isloading 
  };
  return(
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}