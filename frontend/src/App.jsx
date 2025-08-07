import React from 'react'
import { Routes ,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Path from './pages/Path'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path="/" element = {<Home></Home>}></Route>
        <Route path="/login" element = {<Login></Login>}></Route>
        <Route path="/email-verify" element = {<EmailVerify></EmailVerify>}></Route>
        <Route path="/reset-password" element = {<ResetPassword></ResetPassword>}></Route>
        <Route path="/path" element = {<Path></Path>}></Route>

      </Routes>
    </div>
  )
}

export default App