const express=require("express")
const authRouter=express.Router();
const bcrypt=require("bcrypt")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const {validation}=require("../helpers/validation")
const {User}=require("../models/users2")


authRouter.post("/signup",async (req , res)=>{
    // we learn a thing never trust the req.body so we want as many as checks we can make  
    // so before entering the &accesing our web we should -
    // validate our data. 
    // so we need a helper/utils so that can help us to validate the data 
    
    try{
         
    validation(req)
    // now if we save the user we see the password as a plain text so we need to encrypt it lets see how to do it .
    // so we need a library that convert the password into hash (bcrypt)
    var {password,firstname,lastname,phoneno,email}=req.body
    const HashPswd=await bcrypt.hash(password,10)
    // console.log(HashPswd)
    var  password=HashPswd;
    const user=new User({password,firstname,lastname,phoneno,email});
    await user.save();
    res.send(user);
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
// now we are going to make the login api lets see how to make it 
authRouter.post("/login",async (req,res)=>{
        // console.log("h3")
        try{
            const {email,password}=req.body
        if(!validator.isEmail(email)){
            throw new Error("email is not valid")

        }
        // now checking the email exist in the database or not 
        const myuser=await User.findOne({email:email})
    if(!myuser){
        throw new Error("Try different email")
    }
    // if we come to that step  then check password is correct or not 
    // now email exist so now we have to check the password for that . 

    const IsvalidPswdcorrect=await bcrypt.compare(password,myuser.password)
    if(!IsvalidPswdcorrect){
        throw new Error("password is not correct ")
    }
    if(IsvalidPswdcorrect){
        // here we will do the authetication part 
        // create the jwt token
        const token=await jwt.sign({_id:myuser._id},"secdretd passwrodhai@23",{ expiresIn: '1h' })
        res.cookie("token",token,{httpOnly:"true"}) // this is a good practise see things in the res.cookie 
        // console.log(token)
        // Attach it with the cookie . 
        // express gave us the better option for the attaching the cookie . 

        
        
        res.send(myuser)
    }else{
        res.send("user Authentication failed")
    }}catch(err){
        res.status(399).json({message:err.message})
    }
})
authRouter.post("/logout",(req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now())
        })
        res.send("log out succesfully ")
    }catch(err){
        console.log(err.message)
    }
    



})

module.exports=authRouter