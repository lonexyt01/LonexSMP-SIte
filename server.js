// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // frontend

// MongoDB
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

// User schema
const userSchema = new mongoose.Schema({
  email:{type:String,required:true,unique:true},
  username:{type:String,required:true},
  voteKeys:{type:Number,default:0},
  hasVoted:{type:Boolean,default:false},
  voteCode:{type:String,default:"-"}
});
const User = mongoose.model("User",userSchema);

// Register/Login
app.post("/auth",async(req,res)=>{
  const {email,username} = req.body;
  if(!email || !username) return res.status(400).json({msg:"Email va username kerak"});
  let user = await User.findOne({email});
  if(user) return res.json({msg:"Welcome back",user});
  user = new User({email,username});
  await user.save();
  return res.json({msg:"Registered successfully",user});
});

// Vote
app.post("/vote",async(req,res)=>{
  const {email,serverIP} = req.body;
  if(!email || !serverIP) return res.status(400).json({msg:"Email va serverIP kerak"});
  let user = await User.findOne({email});
  if(!user) return res.status(404).json({msg:"User not found"});
  if(user.hasVoted) return res.status(400).json({msg:"Siz allaqachon vote qilgansiz"});

  try{
    const response = await fetch(`https://api.mcsrvstat.us/2/${serverIP}`);
    const data = await response.json();
    if(data.online){
      const voteCode = Math.random().toString(36).substring(2,10).toUpperCase();
      user.voteKeys += 1;
      user.hasVoted = true;
      user.voteCode = voteCode;
      await user.save();

      // Telegram botga yuborish
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=Vote Key: ${voteCode} for ${user.username}`);

      return res.json({msg:"Vote muvaffaqiyatli!",voteCode});
    } else return res.status(400).json({msg:"Server offline"});
  } catch(err){
    return res.status(500).json({msg:"Server tekshirilayotganda xato"});
  }
});

app.listen(3000,()=>console.log("Server running on port 3000"));
