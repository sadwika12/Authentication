import express from 'express'
import {getuserdata} from '../controllers/userverification.js'
import userauth from '../middleware/userauth.js'

const userrouter=express.Router();

userrouter.get('/get-user-data',userauth,getuserdata)
export default userrouter