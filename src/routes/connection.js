// now we are going to make the Connections request routes here in this file. 
const {userAUTH}=require("../middlewares/userauth")
const express=require("express")
const Connections=express.Router();
const ConnectionModel=require("../models/connectionrequest")
const {User}=require("../models/users2")


Connections.post("/request/send/:status/:userId",userAUTH,async (req,res)=>{
    try{
        const touserid=req.params.userId
        const fromuserid=req.user._id
        const status=req.params.status
        const isAllowedStatus=["intrested","ignored"]
    const userexist=await User.findById(touserid)
    if(!userexist){
        return res.json({
            message:"user does not exist "
        })
    }
    if(!isAllowedStatus.includes(status)){
        throw new Error("this type of status is not allowed ")
    }
    const existingconnectionreq=await ConnectionModel.findOne({toUserId:touserid,fromUserId:fromuserid})
    if(existingconnectionreq){
        throw new Error("connection request is already send before ")
    }


    const reverseconnection=await ConnectionModel.findOne({toUserId:fromuserid,fromUserId:touserid})
    if(reverseconnection){
        throw new Error("u can not send the connection req that person already send that to u ")
    }
        const connection=new ConnectionModel({fromUserId:fromuserid,toUserId:touserid,status:status})
        const data=await connection.save();
        res.json({
            message:"sent ",
            data:userexist
        })
    }catch(err){
        res.status(500).send(err.message)
    }
    
})
Connections.post("/request/review/:status/:requestID",userAUTH,async(req,res)=>{
    try{
        
        const status=req.params.status
        const allowedstatus=["accepted","rejected"]
        if(!allowedstatus.includes(status)){
            throw new Error("allowed status is not valid ");
        }
        const loggedINID=req.user._id
        const requestID=req.params.requestID;
         
        // const ISVALIDREQUESTID=await ConnectionModel.findOne({
        //     status:"intrested",
        //     _id:requestID,
        //     toUserId:loggedINID
        // })
          const ISVALIDREQUESTID = await ConnectionModel.findOne({
            status: "intrested",
            fromUserId:requestID,
            toUserId: loggedINID
        });
        if(!ISVALIDREQUESTID){
            return res.status(404).json({
                message:"request is not vvalid dear uhh it sucks "
            })
        }
        ISVALIDREQUESTID.status=status;
        const data= await ISVALIDREQUESTID.save();
        res.json({
            message:"sab thik hai ",
            data
        })
    }catch(err){
        res.status(400).send(err.message)
    }
})
module.exports=Connections