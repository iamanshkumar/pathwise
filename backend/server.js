import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"


const app = express()
const port = process.env.PORT || 4000
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true})) //can send cookies in response from express app


app.get("/",(req,res)=>{
    res.send("Home page")
})

app.listen(port , ()=>{
    console.log(`Severer is running at port : ${port}`)
})