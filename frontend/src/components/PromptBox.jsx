import React from 'react'
import { useNavigate } from 'react-router-dom'

const PromptBox = () => {
  const navigate = useNavigate()

  const submitHandler = ()=>{
    navigate("/path")
  }
  return (
    <div className='p-5  rounded-xl bg-white w-1/2 flex flex-col justify-center items-center gap-4 border border-neutral-200 m-10'>
        <input className='borderrounded shadow p-2 focus:outline-none bg-gray-100 text-gray-700 w-full focus:bg-white focus:shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-200 placehoder-gray-500  ' type="text" placeholder='What do you want to learn ?'/>
        <p>Try : "Full stack web development" or "Aptitude for interviews"</p>
        <button onClick={submitHandler} className='rounded-lg px-6 py-2 m-0 border-2 bg-black text-white hover:bg-slate-800'>Generate My Roadmap</button>
    </div>
  )
}

export default PromptBox