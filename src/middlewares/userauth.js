const jwt=require("jsonwebtoken")
const {User}=require("../models/users2")

const userAUTH=async (req,res,next)=>{
      
     // login api and sign up api does not need the auterization but all other api rather than need an authorization . 
     try{
         
         const {token}=req.cookies
         if(!token){
            return res.status(401).send("please log in . ")
         }
       
         const decodedmessage=await jwt.verify(token,"secdretd passwrodhai@23")
         const {_id}=decodedmessage;
         const user=await User.findById(_id)
         if(!user){
            throw new Error("user not found ")
         }
         
         req.user=user; // this is the way of attaching the user in the req u can see here. 
        


next();
     }catch(err){
         return res.status(400).send(err.message)
     }
      
}
module.exports={userAUTH};