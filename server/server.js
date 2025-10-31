import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connecttoDb from "./CONFIG/db.js"
import  authrouter from './routes/authroutes.js'
import userrouter from './routes/userroutes.js'

const app=express()

const port=process.env.PORT || 5000

connecttoDb()


const allowedorigins=['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedorigins,credentials:true}))

app.get('/',(req,res)=>{
  res.json("hello world")
})
app.use('/api/auth',authrouter)
app.use('/api/user',userrouter)



app.listen(port,()=>{
  console.log("server started")
})
