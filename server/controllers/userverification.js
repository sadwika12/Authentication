import UserModel from "../models/usermodel.js";
import jwt from 'jsonwebtoken';
const { JsonWebTokenError } = jwt;

export const getuserdata=async (req,res)=>{
  try{
    const {userId}=req.body
    const user=await UserModel.findById(userId)
    if(!user){
      return res.status(400).json({success:false,message:"User does not exists"})
    }
    return res.status(200).json({
      success:true,
      message:"User data fetched successfully",
      data:{name:user.name,email:user.email,isVerified:user.isVerified}
    })
  }
  catch(error){
    return res.status(500).json({success:false,message:error.message})
  }
}