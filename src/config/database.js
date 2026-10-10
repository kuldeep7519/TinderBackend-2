const mongoose=require("mongoose")

const connectDB=async()=>{
await mongoose.connect("mongodb+srv://kuldeeprao9812_db_user:Kannu123@cluster0.hf3i9xu.mongodb.net/Tinder")
}
module.exports=connectDB;
