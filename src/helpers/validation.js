const validator=require("validator")
const validation=(req)=>{
    const {firstname,lastname,phoneno,password,email}=req.body
    if(!firstname || !lastname){
        throw new Error("please enter  a name ")
    }
    // these all things we define it in the db level . we want tight security 
    if (!phoneno  ) {
  throw new Error("Please enter a valid 10-digit phone number.");
}
    if(!validator.isEmail(email)){
        throw new Error("please enter valid email id ")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Tagdo so dal lodu ")
    }
if(!email.endsWith("@gmail.com")){
        throw new Error("gmailnotallowed")
    }
}
module.exports={validation}