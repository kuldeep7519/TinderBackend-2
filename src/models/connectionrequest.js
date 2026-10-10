
const mongoose=require("mongoose")


const ConnectionSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","intrested","accepted","rejected"],
            message:"{VALUE} IS NOT VALID "
        }
    }
},
{
    timestamps:true
})

ConnectionSchema.pre("save",function(next){
    const connection=this;

    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error("this is casual way of doing that ")
    }
    // this is a middleware so always use the next 
    // but dont know it is not working fine next();
    })
const ConnectionModel=mongoose.model("Connection",ConnectionSchema)
module.exports=ConnectionModel


