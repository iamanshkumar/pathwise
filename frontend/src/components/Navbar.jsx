import React from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {
  return (
    <div className='w-full flex justify-between items-center p-3.5 sm:p-3.5 sm:px-4 absolute top-0 '>
        <div>
          <h1 className=' flex gap-1.5 justify-center items-baseline text-3xl sm:text-3xl font-semibold'> <img className='w-8' src={assets.logo} alt="logo" />Pathwise</h1>
        </div>
        <div className='flex justify-evenly items-center w-2/5'>
          <button>Home</button>
          <button>About</button>
          <button>Features</button>
          <button>Login</button>
          <button className='rounded-lg px-6 py-2 m-0 border-2 border-black hover:bg-black hover:text-white'>Register</button>
        </div>
        
    </div>
  )
}

export default Navbar