import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import PromptBox from '../components/PromptBox'

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-3.5 min-h-screen bg-amber-100'>
        <Navbar></Navbar>
        <Header></Header>
        <PromptBox></PromptBox>
    </div>
  )
}

export default Home