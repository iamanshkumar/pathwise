import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"
// Add this for ES modules:
import { fileURLToPath } from 'url'
import transporter from "../config/nodemailer.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, '../templates/welcome.html');
const verifyTemplatePath = path.join(__dirname,"../templates/accountVerified.html")
const verificationOtpPath = path.join(__dirname,"../templates/verificationOtp.html")


export const register = async  (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.json({success:false, message: "Missing details"})
    }

    try {
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({name, email, password: hashedPassword})
        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge: 7*24*60*60*1000
        })

        // Read and send the welcome email
        let html = fs.readFileSync(templatePath, 'utf8')
        html = html.replace("{{userName}}", name)
        html = html.replace("{{loginLink}}", "https://pathwise.com/login")

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Pathwise",
            html: html
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true})

    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body


    if(!email || !password){
        return res.json({success:false , message : "Email and password are required"})
    }


    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false , message : "Invalid Email"})
        }


        const isMatch = await bcrypt.compare(password , user.password)


        if(!isMatch){
            return res.json({success:false , message : "Invalid Password"})
        }


        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : "7d"} )


        res.cookie("token" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge : 7*24*60*60*1000
        })


        return res.json({success : true})




    }catch(error){
        return res.json({success:false , message : error.message})
    }
}


export const logout = async (req,res)=>{
    try{
        res.clearCookie("token",{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? "none" : "strict"
        })


        return res.json({success:true , message : "Logged out"})
    }catch(error){
        res.json({success:false , message : error.message})
    }
}

//Send otp to the user's email
export const sendVerifyOtp = async (req,res)=>{
    try{
        const userId = req.user?.id
        if(!userId) {
            return res.json({success : false , message : "User ID not found"})
        }
        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success : false , message : "User not found"})
        }

        if(user.isVerified){
            return res.json({success : false , message : "Account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))

        user.verifyOtp = otp
        user.verifyOtpExpiredAt = Date.now() + 24*60*60*1000

        await user.save()

        let html = fs.readFileSync(verificationOtpPath, 'utf8')
        html = html.replace("{{userName}}", user.name)
        html = html.replace("{{otp}}", otp);
        html = html.replace("{{loginLink}}", "https://pathwise.com/login")

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Your OTP Code – Pathwise ",
            html: html
        }

        await transporter.sendMail(mailOption)

        return res.json({success : true , message : "Verification OTP sent on email"})

    }catch(error){
        return res.json({success : false , message : error.message})
    }
}

export const verifyEmail = async (req,res)=>{
    const {otp} = req.body
    const userId = req.user?.id;
    if(!userId || !otp){
        return res.json({success : false , message : "Missing Details"})
    }

    try{

        const user = await userModel.findById(userId)

        if(!user){
            return res.json({success : false , message : "User not found"})
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success : false , message : "Invalid OTP"})
        }

        if(user.verifyOtpExpiredAt<Date.now()){
            return res.json({success : false , message : "OTP Expired"})
        }

        user.isVerified = true

        user.verifyOtp = "";
        user.verifyOtpExpiredAt = 0;

        await user.save()
        let html = fs.readFileSync(verifyTemplatePath, 'utf8')
        html = html.replace("{{userName}}", user.name)
        html = html.replace("{{loginLink}}", "https://pathwise.com/login")

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verified Successfully!",
            html: html
        }

        await transporter.sendMail(mailOption)

        

        return res.json({success : true , message : "User verified successfully!"})

    }catch(error){
        return res.json({success : false , message : error.message})
    }
}
