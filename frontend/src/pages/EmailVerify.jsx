import React, { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from '../context/AppContext';
import axios from "axios"
import { toast } from 'react-toastify';

const EmailVerify = () => {

  axios.defaults.withCredentials=true
  const navigate = useNavigate();
  const inputRefs = React.useRef([])
  const {backendUrl , isLoggedIn , userData , getUserData} = useContext(AppContext)

  const handleInput = (e,index)=>{
    if(e.target.value.length>0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus()
    }
  }

  const handleKeyDown = (e,index)=>{
    if(e.key==="Backspace" && e.target.value === "" && index>0){
      inputRefs.current[index-1].focus()
    }
  }

  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData("text")
    const pasteArray = paste.split("")
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char
      }
    })
  }

  const onSubmitHandler = async (e)=>{
    try{
      e.preventDefault()
      const otpArray = inputRefs.current.map(e=>e.value)
      const otp = otpArray.join("")
      const {data} = axios.post(backendUrl + "/api/auth/verify-account",{otp})

      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate("/")
      }else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    isLoggedIn && userData && userData.isVerified && navigate("/")
  },[isLoggedIn,userData])

  return (
    <div>
      <div className="w-full flex justify-between items-center p-3.5 sm:p-3.5 sm:px-4 absolute top-0 ">
        <div>
          <h1
            className=" flex gap-1.5 justify-center items-baseline text-3xl sm:text-3xl font-semibold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            {" "}
            <img className="w-8" src={assets.logo} alt="logo" onClick={()=>navigate("/")} />
            Pathwise
          </h1>
        </div>
      </div>

      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col '>
        <form onSubmit={onSubmitHandler} className='bg-neutral-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP </h1>
          <p className='text-center mb-6 text-neutral-200'>Enter the 6 digit code sent on your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
              <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-neutral-700 text-white text-center text-xl rounded-md'
              ref={e=>inputRefs.current[index]=e} onInput={(e)=> handleInput(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)}/>
            ))}
          </div>
          <button className='w-full py-3 bg-white text-black font-medium rounded hover:cursor-pointer'>Verify Email</button>
        </form>
      </div>
    </div>
  )
}

export default EmailVerify