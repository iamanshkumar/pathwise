import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full flex justify-between items-center p-3.5 sm:p-3.5 sm:px-24 absolute top-0'>
        <h1 className='text-3xl sm:text-4xl font-semibold'>Pathwise</h1>
        <button className='flex items-center gap-2 rounded-lg px-6 py-2 text-white bg-black hover:bg-neutral-900'>Login</button>
    </div>
  )
}

export default Navbar