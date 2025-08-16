import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate();
  const [email,setEmail] = useState("")
  const [newPassword , setNewPassword] = useState("")
  const [isEmailSent , setIsEmailSent] = useState("")
  const [otp , setOtp] = useState(0)
  const [isOtpSubmited , setIsOtpSubmited] = useState(false)

  const inputRefs = React.useRef([])

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

  const onSubmitEmail = async(e)=>{
    e.preventDefault();
    try{
      const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp" , {email})
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);   
      } else {
        toast.error(data.message);
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  const onSubmitOtp =  async(e)=>{
    e.preventDefault()
    const otpArray = inputRefs.current.map(e=>e.value)
    setOtp(otpArray.join(""))
    setIsOtpSubmited(true)
  }

  const onSubmitNewPassword =  async(e)=>{
    e.preventDefault()
    try{
      const {data} = await axios.post(backendUrl + "/api/auth/reset-password" , {email,otp,newPassword})

      if(data.success){
        toast.success(data.message)
        navigate("/login")
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

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

      {!isEmailSent && 
      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col '>
        <h2 className="text-4xl font-semibold p-1.5">
          Reset Password
        </h2>
        <p className="font-normal text-neutral-600 p-1.5 pb-3">
          Enter your registered email address
        </p>
        <form onSubmit={onSubmitEmail} className='flex justify-between gap-2.5 flex-col'>
          <input
            type="email"
            placeholder="Email"
            className="border rounded border-neutral-300 p-2 w-xs"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <button className="rounded w-full bg-black text-white p-2">
            Submit
          </button>
        </form>
        
      </div>
      }


      {!isOtpSubmited && isEmailSent &&

      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col '>
      <form onSubmit={onSubmitOtp } className='bg-neutral-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-neutral-200'>Enter the 6 digit code sent on your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
              <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-neutral-700 text-white text-center text-xl rounded-md'
              ref={e=>inputRefs.current[index]=e} onInput={(e)=> handleInput(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)}/>
            ))}
          </div>
          <button className='w-full py-3 bg-white text-black font-medium rounded hover:cursor-pointer'>Submit</button>
        </form>
      </div>
      }

      {isOtpSubmited && isEmailSent &&

      <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col '>
        <h2 className="text-4xl font-semibold p-1.5">
          New Password
        </h2>
        <p className="font-normal text-neutral-600 p-1.5 pb-3">
          Enter your new password
        </p>
        <form onSubmit={onSubmitNewPassword } className='flex justify-between gap-2.5 flex-col'>
          <input
            type="password"
            placeholder="New Password"
            className="border rounded border-neutral-300 p-2 w-xs"
            value={newPassword}
            onChange={(e)=>setNewPassword (e.target.value)}
            required
          />
          <button className="rounded w-full bg-black text-white p-2">
            Submit
          </button>
        </form>
        
      </div>
      }
    </div>
  )
}

export default ResetPassword