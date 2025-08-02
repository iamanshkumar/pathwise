import React from 'react'
import {assets} from "../assets/assets"

const About = () => {
  return (
    <div className=' flex flex-col justify-center items-center p-5 bg-neutral-100'>
        <h1 className='text-4xl font-semibold'>How it Works</h1>
        <h2 className='text-xl font-normal text-neutral-700 p-4'>Get started in just three simple steps</h2>
        <div className='flex py-20 px-32 gap-6 '>
            <div className='rounded shadow p-6 flex flex-col justify-between items-center bg-white'>
                <img className ="w-20" src={assets.pen} alt="" />
                <h1 className='p-4 font-medium'>1.Enter a topic</h1>
                <p>Type your learning goal or prompt and let our AI understand what you want to master</p>
            </div>

            <div className='rounded shadow p-6 flex flex-col justify-between items-center bg-white'>
                <img className ="w-20" src={assets.roadmap} alt="" />
                <h1 className='p-4 font-medium'>2.Get your roadmap</h1>
                <p>Recieve a customised learning plan with curated videos and structured modules</p>
            </div>

            <div className='rounded shadow p-6 flex flex-col justify-between items-center bg-white'>
                <img className ="w-20" src={assets.graph} alt="" />
                <h1 className='p-4 font-medium'>3.Track and Quiz</h1>
                <p>Watch videos, take personalized quizzes, and see your progress grow over time</p>
            </div>
        </div>
    </div>
  )
}

export default About