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
Connections.post(
  "/request/review/:status/:requestID",
  userAUTH,
  async (req, res) => {
    try {
      const { status, requestID } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const loggedINID = req.user._id;

      // Find request by connection request ID
      const validRequest = await ConnectionModel.findOne({
        _id: requestID,
        status: "intrested",
        toUserId: loggedINID,
      });

      if (!validRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      validRequest.status = status;

      const data = await validRequest.save();

      return res.status(200).json({
        message: `Request ${status} successfully`,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);
module.exports=Connections