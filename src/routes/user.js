// now we are going to make the user routes here for the connections

const express = require("express");
const { userAUTH } = require("../middlewares/userauth");
const userroutes = express.Router();
const {User}=require("../models/users2")
const connectionModel = require("../models/connectionrequest");
//getting all pending connection request for the logged in  user
userroutes.get("/user/request", userAUTH, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const connectionrequest = await connectionModel
      .find({
        toUserId: loggedinuser._id,
        status: "intrested",
      })
      .populate("fromUserId", "firstname lastname"); // what if i dont send the second parameter then it will send the whole details

    res.json({
      message: "data fetched succesfullly ",
      data: connectionrequest,
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
});
userroutes.get("/user/connections", userAUTH, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const connections = await connectionModel.find({
      $or:
        [{
          toUserId: loggedinuser._id,
          status: "accepted",
        },
        { fromUserId: loggedinuser._id, status: "accepted" }],
    }).populate("fromUserId", "firstname lastname age gender phoneno")
      .populate("toUserId", "firstname lastname age gender photoUrl phoneno about");

    const data = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() ===
        loggedinuser._id.toString()
      ) {
        return connection.toUserId;
      }

      return connection.fromUserId;
    });
    res.json({
        message:"we fetched all our connnections ",
        data:data
    })
  } catch (err) {
    res.status(404).send(err.message);
  }
});
userroutes.get("/user/feed",userAUTH,async(req,res)=>{
  try{
    // user should see all the cards except . 
    // 1.his own card 
    // 2.intrested profile again
    // 3. ignored profile 
    // 4. already sent the connection request
    const loggedinuser=req.user
    
    const page=parseInt(req.query.page)||1; // this or we are using if user does not give the params then take 1   and whateveer comes from the query come as a string so we need a interger .thats why we are using parseInt 
    let limit=parseInt(req.query.limit)||10;
    // if we pass limit =10000000 then it will freeze and hang our database to fix that sanitize the data . 
    limit=limit>50?50:limit
    const skip=(page-1)*limit
    // finding all connection request (sent +received)
    const connectionrequest= await connectionModel.find({
      $or:[
        {fromUserId:loggedinuser._id},
        {toUserId:loggedinuser._id}
      ]
    }).select("fromUserId toUserId")
    // .populate("fromUserId","firstname").populate("toUserId","firstname")
    
    const Hidedata=new Set();
    connectionrequest.forEach((req)=>{

      Hidedata.add(req.fromUserId.toString())
      Hidedata.add(req.toUserId.toString())
    }
    )
    console.log(Hidedata)
    const feeduser= await User.find({
      // see the logical query in the mongo db atlas docs
      $and:[
        {_id:{$nin:Array.from(Hidedata)}},
        {_id:{$ne:loggedinuser._id}}
      ]
    }).select("firstname lastname phoneno email skills").skip(skip).limit(limit)
    res.send(feeduser)
  }catch(err){
    res.status(404).json({message:err.message})
      // its ok till there now we want that if i m a new user and there are already 1000 user then i will see the 999 user nonno onononno   so i need a concept of pagination lets see how it works we will get only l0 result at a time . 
//     2. Query parameters ke beech ? ki jagah & lagega

// ? — query parameters shuru karne ke liye.

// & — agla parameter add karne ke liye.
    
  }
})
module.exports = userroutes;
