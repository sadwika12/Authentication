
import jwt from "jsonwebtoken"
const userauth=async(req,res,next)=>{
    const {token}=req.cookies
    if(!token){
      return res.status(401).json({sucess:false,message:"unauthorized,login required"})
    }
    try{
        const decodedtoken=jwt.verify(token,process.env.JWT_SECRET);
        if (typeof req.body === 'undefined') {
            req.body = {};
        }

        if(decodedtoken.id){
          req.body.userId=decodedtoken.id
          next()
        }else{
          return res.status(401).json({sucess:false,message:"unauthorized,login required"})
        }

     
    }
    catch(error){
           return res.status(401).json({ sucess: false, message: "Unauthorized: Invalid or expired token" });
      return res.status(500).json({sucess:false,message:error.message})
    }
}
export default userauth;
