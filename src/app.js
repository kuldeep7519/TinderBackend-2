const express =require("express")
const connectDB=require("./config/database")
const profileauth=require("./routes/profile")
const authRouter=require("./routes/auth")
const cookieparser=require("cookie-parser")
const Connections=require("./routes/connection")
const userroutes=require("./routes/user")
const app=express();
const cors=require("cors")
const dns=require("dns")
dns.setServers(["8.8.8.8"])
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin:"http://3.106.119.176:80",
    credentials:true
}))

// now we are going to learn the validation refer to mongoose doc 
app.use("/",authRouter)
app.use("/",profileauth)
app.use("/",Connections)
app.use("/",userroutes)
// making the send connection req lets see how to make it 
// app.post("/sendreq",userAUTH,async (req,res)=>{

// })
connectDB().then(()=>{
    console.log("connection succesfull ")
    app.listen(7777,()=>{
    console.log("server is on way of port:300")
})
}).catch(err=>{
    console.error("databse connection refused "+err)
})
 

// so this is a problem of doing ctrl + c agian and again so we will do a thing if i change anything in my file it syncs with it {dowload nodeman for it in the global }