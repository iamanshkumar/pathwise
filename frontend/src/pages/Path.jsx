import React, { useContext, useEffect, useState , useRef } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Path = () => {

  const [goal,setGoal] = useState("")
  const [roadmap , setRoadmap] = useState([])
  const [loading , setLoading] = useState(false)

  const {backendUrl , isLoggedIn} = useContext(AppContext)

  const roadmapRef = useRef(null)

  const navigate = useNavigate()

  const generateRoadmap = async (event)=>{
    event.preventDefault()

    if(!goal.trim()){
      toast.info("Please enter a learning goal!")
      return
    }

    if(!isLoggedIn){
      navigate("/login")
      return
    }

    const currentGoal = goal;
    setGoal("")
    setLoading(true)
    setRoadmap([])
    try{
      const response = await axios.post(backendUrl + "/api/roadmap" , {goal : currentGoal})
      if(response){
        const temp = []
        Object.values(response.data).forEach(obj=>{
          temp.push(obj)
        })
        setRoadmap(temp)
      }else{
        toast.error(response.message);
      }
    }catch(error){
      toast.error(error.message)
    }finally{setLoading(false)}
  }

  useEffect(()=>{

    if(roadmap.length>0 && roadmapRef.current){
      setTimeout(()=>{
        roadmapRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      },100)
    }
  },[roadmap])


  return (
    
    <>
    <Navbar></Navbar>
    <div className='min-w-screen flex flex-col justify-center items-center min-h-screen'>
      <h1 className='text-5xl font-semibold'>Master Any Skill With AI-Powered Learning</h1>
      <h5 className='text-xl text-neutral-700'>Get personalized roadmaps, curated video content, and interactive quizzes for any topic you want to learn</h5>

      <div>
        <form onSubmit={generateRoadmap} className=' m-3.5 flex min-w-3xl border border-neutral-300 rounded p-3 gap-2.5'>
          <input onChange={(e)=>setGoal (e.target.value)} className='min-w-xl p-2 bg-neutral-100 rounded' type="text" placeholder='What do you want to learn' value={goal}/>
          <button className='px-4 py-2 bg-black text-white rounded disabled:bg-neutral-700' disabled={loading}>{loading? "Generating" : "Generate Roadmap"}</button>
        </form>
      </div>
    </div>

    <div ref={roadmapRef}>
  {roadmap.length > 0 && (
    <div className="min-w-screen bg-black p-8 mt-5 rounded flex flex-col justify-center items-center">
      <h1 className="text-5xl font-medium text-white text-center mb-10">Roadmap</h1>
      <div className="relative w-full max-w-4xl">
        {/* Timeline vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-neutral-700"></div>

        {roadmap.map((item, index) => (
          <div
            key={index}
            className={`mb-8 flex w-full items-center ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="relative w-1/2">
              {/* Timeline dot */}
              <div className="absolute top-5 -left-3 w-6 h-6 rounded-full bg-purple-500 border-4 border-black z-10"></div>

              <div className="bg-neutral-900 p-5 rounded-2xl shadow-md border border-neutral-800">
                <h3 className="font-semibold text-xl text-white">{item.heading}</h3>
                <p className="text-sm text-neutral-400">{item.desc}</p>
                <button className="mt-3 py-2 px-4 bg-neutral-800 text-white rounded-lg w-full">
                  Complete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

    </>   
  )
}

export default Path