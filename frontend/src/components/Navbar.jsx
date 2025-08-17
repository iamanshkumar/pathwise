import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Navbar = ({ scrollToAbout }) => {
  const navigate = useNavigate()
  const {userData,backendUrl,setUserData,setIsLoggedIn} = useContext(AppContext)

  const home = ()=>{
    navigate("/")
  }

  const sendVerificationOtp = async()=>{
    try{

      axios.defaults.withCredentials = true;

      const response = await axios.post(backendUrl + "/api/auth/send-verify-otp")
      const data = response.data

      if(data.success){
        navigate("/email-verify")
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(error.message)
    }
  }

  const logout = async()=>{
    try{
      axios.defaults.withCredentials=true
      const {data} = await axios.post(backendUrl+"/api/auth/logout")
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate("/")
    }catch(error){
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-3.5 sm:p-3.5 sm:px-4 absolute top-0 hover:cursor-pointer '>
      <div onClick={home}>
        <h1 className='flex gap-1.5 justify-center items-baseline text-3xl sm:text-3xl font-semibold'>
          <img className='w-8' src={assets.logo} alt="logo" />
          Pathwise
        </h1>
      </div>

      {userData ?
      <div className='mx-7 w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group text-xl p-5'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 text-[14px] w-36'>
          <ul className='list-none m-1 p-2.5 bg-black text-white rounded'>
            {!userData.isVerified && <li className='py-1 px-2 cursor-pointer' onClick={sendVerificationOtp}>Verify Email</li>}
            
            <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
          </ul>
        </div>
      </div> : 
      <div className='flex justify-evenly items-center w-2/5'>
        <button>Home</button>
        <button onClick={scrollToAbout} className='hover:cursor-pointer'>About</button>
        <button>Features</button>
        <button
          onClick={() => navigate("/login")}
          className='rounded-lg px-6 py-2 m-0 border-2 border-black hover:bg-black hover:text-white'
        >
          Login
        </button>
      </div>
        }
      
    </div>
  );
};

export default Navbar;