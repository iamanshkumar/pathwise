import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)
    const [loading, setLoading] = useState(true);

    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + "/api/auth/is-auth")
            if(data.success){
                setIsLoggedIn(true)
                await getUserData()
            }
        }catch(error){
            toast.error(error.message)
        }finally {
            setLoading(false); 
        }
    }

    const getUserData = async()=>{
        try{
            const {data} = await axios.get(backendUrl + "/api/user/data")
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }catch(error){
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])
        
    const value = {
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData,
        loading,
    }
    return (

        
        <AppContext.Provider value ={value}>
            {props.children}
        </AppContext.Provider>
    )
}