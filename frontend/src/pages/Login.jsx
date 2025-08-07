import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios"
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const {backendUrl , setIsLoggedIn , getUserData} = useContext(AppContext)
  const onSubmitHandler = async(e)=>{
    try{
      e.preventDefault()

      axios.defaults.withCredentials = true //will send cookies with the request

      if(state === "Sign Up"){
        const {data} = await axios.post(backendUrl + "/api/auth/register" , {name,email,password})

        if(data.success){
          setIsLoggedIn(true)
          getUserData()
          navigate("/path")
        }else{
          toast.error(data.message)
        }
      }else{
        const {data} = await axios.post(backendUrl + "/api/auth/login" , {email,password})

        if(data.success){
          setIsLoggedIn(true)
          getUserData()
          navigate("/path")
        }else{
          toast.error(data.message)
        }
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

      <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col ">
        <h2 className="text-4xl font-semibold p-1.5">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="font-normal text-neutral-600 p-1.5 pb-3">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}
          className="flex flex-col gap-3.5">
          {state === "Sign Up" && (
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded border-neutral-300 p-2 w-xs"
              onChange={e=> setName(e.target.value)}
              value = {name}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="border rounded border-neutral-300 p-2 w-xs"
            onChange={e=> setEmail(e.target.value)}
            value = {email}
          /> 
          <input
            type="password"
            placeholder="Password"
            className="border rounded border-neutral-300 p-2 w-xs"
            onChange={e=> setPassword(e.target.value)}
            value = {password}
          />
          {state !== "Sign Up" && (
            <p onClick={()=>navigate("/reset-password")} className="cursor-pointer hover:underline">Forgot password?</p>
          )}
          <button className="rounded w-full bg-black text-white p-2">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-center mt-2">
            Already have an account?{" "}
            <span
              className="cursor-pointer hover:underline"
              onClick={() => {
                setState("Login");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center mt-2">
            Don't have an account?{" "}
            <span
              className="cursor-pointer hover:underline"
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
