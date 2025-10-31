import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const { JsonWebTokenError } = jwt;
import UserModel from "../models/usermodel.js"
import transporter from "../CONFIG/nodemailer.js"
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({ sucess:false,message: "All fields are required" });
    }
    try{
        const existingUser=await UserModel.findOne({email:email})
        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists"})
        }

       const hashedPassword= await bcrypt.hash(password,10) 
       const user=new UserModel({name,email,password:hashedPassword})
       await user.save()
       
       const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'lax',
        maxAge:7*24*60*60*1000
       })

       //sending email
        const mailoptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'welcome Developer',
            text:`wecome to this community.Your account has been creted with the email id: ${email}`
        }

        await transporter.sendMail(mailoptions)
        return res.status(201).json({success:true,message:"Registered successfully"})
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }

}

export const login=async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password) {
        return res.status(400).json({ sucess:false,message: "All fields are required" });
    }

    try{
        const user=await UserModel.findOne({email:email})
        if(!user){
            return res.status(400).json({success:false,message:"User does not exists"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({success:false,message:"Invalid credentials"})
        }

         const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'lax',
        maxAge:7*24*60*60*1000
       })
       return res.status(200).json({sucess:true,message:"Logged in successfully"})
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }

}

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'Lax',
        })
        return res.status(200).json({sucess:true,message:"Logged Out sucessfully"})
    }catch(error){
        return res.status(500).json({sucess:false,message:error.message})
    }
}


export const sendverifyotp=async(req,res)=>{
    try{

        const {userId}=req.body;
        const user=await UserModel.findById(userId)
        if(user.isVerified){
            return res.json({sucess:false,message:"User is already verified"})
        }
        const otp=Math.floor(100000+Math.random()*900000);
        user.verifyOTP=otp;
        user.verrifyOTPExpiryAt=Date.now()+24*60*60*1000
        await user.save();

        const mailoptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Verify your email',
            text:`Your OTP for email verification is ${otp}. It is valid for 24 hours.`
        }

        await transporter.sendMail(mailoptions)

        res.json({sucess:true,message:"OTP sent to your email"})
    }
    catch(error){
        res.json({sucess:false,message:error.message})
    }
}

export const verifyemail=async(req,res)=>{
        const {userId,otp}=req.body;
        if(!userId || !otp){
            return res.status(400).json({sucess:false,message:"All fields are required"})
        }
        const user=await UserModel.findById(userId)
        try{
            if(!user){
                return res.status(400).json({sucess:false,message:"User does not exists"})
            }
            if(user.verifyOTP==='' || user.verifyOTP!==otp){
                return res.status(400).json({sucess:false,message:"Invalid OTP"})
            }
            if(user.verrifyOTPExpiryAt<Date.now()){
                return res.status(400).json({sucess:false,message:"OTP expired"})
            }
            user.isVerified=true;
            user.verifyOTP='';
            user.verrifyOTPExpiryAt=0;
            await user.save();
            return res.status(200).json({sucess:true,message:"Email verified successfully"})
        }

    
    catch(error){
        return res.status(500).json({sucess:false,message:error.message})
    }
}


export const isauthenticated=async(req,res)=>{
    try{
        
        return res.status(200).json({sucess:true,message:"User is authenticated"})
    }
    catch(error){
        return res.status(500).json({sucess:false,message:error.message})
    }
}

//forgot password

export const passwordresetotp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.status(400).json({sucess:false,message:"email is required"})
    }
    try{
        const user=await UserModel.findOne({email:email})
        if(!user){
            return res.status(400).json({sucess:false,message:"User does not exists"})
        }
        const otp=Math.floor(100000+Math.random()*900000);
        user.resetOtp=otp
        user.resetOtpExpiryAt=Date.now()+15*60*1000
        await user.save()

        const mailoption={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Password reset OTP",
            text:`Your OTP for password reset is ${otp}. It is valid for 15 minutes.`
        }
        await transporter.sendMail(mailoption)
        return res.status(200).json({sucess:true,message:"OTP sent to your email"})
    }
    catch(error){
        return res.status(500).json({sucess:false,message:error.message})
    }
}

export const resetpassword=async(req,res)=>{
    const {email,newpassword}=req.body;
    if(!email || !newpassword){
        return res.status(400).json({sucess:false,message:"All fields are required"})
    }
    try{
        const user=await UserModel.findOne({email:email})
        if(!user){
            return res.status(400).json({sucess:false,message:"User does not exists"})
        }
        if(newpassword.length<6){
            return res.status(400).json({sucess:false,message:"Password must be at least 6 characters"})
        }
        if(newpassword === user.password){
            return res.status(400).json({sucess:false,message:"Please enter a new password"})
        }
        const hashedPassword=await bcrypt.hash(newpassword,10)
        user.password=hashedPassword;
        await user.save();
        return res.status(200).json({sucess:true,message:"Password reset successfully"})
    }
    catch(error){
        return res.status(500).json({sucess:false,message:error.message})
    }
}

//reset password

export const resetpasswordourself=async(req,res)=>{
    try{
        const {userId}=req.body
        const user=await UserModel.findById(userId)
        if(!user){
          return res.status(400).json({success:false,message:"User does not exists"})
        }
        const {oldpassword,newpassword}=req.body
        if(!oldpassword || !newpassword){
            return res.status(400).json({sucess:false,message:"All fields are required"})
        }
        if(oldpassword===newpassword){
            return res.status(401).json({sucess:false,message:"New password must be different from old password"})
        }
        if(newpassword.length<6){
            return res.status(400).json({sucess:false,message:"Password must be at least 6 characters"})
        }
        const isMatch=await bcrypt.compare(oldpassword,user.password)
        if(!isMatch){
            return res.status(401).json({success:false,message:"Old password is incorrect"})
        }
        const hashedPassword=await bcrypt.hash(newpassword,10)
        user.password=hashedPassword
        await user.save()
        return res.status(200).json({success:true,message:"Password reset successfully"})
    }
    catch(error){
       return res.status(500).json({success:false,message:error.message})
    }
}

export const otpverification=async(req,res)=>{
    const {email,otp}=req.body
    if(!email|| !otp){
        return res.status(400).json({sucess:false,message:"All fields are required"})
    }
    try{
        const user=await UserModel.findOne({email:email})
        if(!user){
            return res.status(400).json({sucess:false,message:"User does not exists"})
        }
        if(user.resetOtp==='' || user.resetOtp!==otp){
            return res.status(400).json({sucess:false,message:"Invalid OTP"})
        }
        if(user.resetOtpExpiryAt<Date.now()){
            return res.status(400).json({sucess:false,message:"OTP expired"})
        }
        user.resetOtp = '';
        user.resetOtpExpiryAt = undefined;
        await user.save();
        return res.status(200).json({ sucess: true, message: "OTP Verified. Ready for password change." });
    }
    catch(error){
        console.log("error required",error);
    }
}
