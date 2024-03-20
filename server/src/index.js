import express from "express"
import cors from "cors"
import {v4 as uuid} from "uuid"
import bcrypt from "bcrypt"
const app=express()
import {connectDB} from '../data/database.js'
import playerModel from "../models/usersSchema.js"
import jwt from 'jsonwebtoken'
import http from "http"

import {Server} from "socket.io"


const server = new http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
})

app.use(cors());
app.use(express.json());

connectDB();

const sktId=[]

io.on("connection",(socket)=>
{
    
    socket.emit("welcome",`Welcome To The Game`)
    socket.broadcast.emit("welcome",`this is id, ${socket.id}`)
    
    socket.on("message",(data)=>
    {
        // console.log(data)
       
       io.emit("recieve-msg",data)
    })

    socket.on("start",(data)=>
    {
        sktId.push(socket.id)
        io.to(socket.id).emit("start",data);
    })

    socket.on("rolled",(data)=>
    {
        // console.log(data)
        let opponentSocketId=(socket.id==sktId[0])?sktId[1]:sktId[0];
       
       io.to(socket.id).emit("turn",false)
       io.emit("rolledNo",data)
       socket.broadcast.emit("turn",true)
       console.log(sktId)
       console.log("->>>",socket.id)
    })

    // socket.on("disconnect",()=>{console.log("user disconnected")})
})


app.post("/login",async(req,res)=>
{try{
const {email,pass}=req.body;

const p=await playerModel.findOne({email:email}).select("+pass")
if(!p){return res.json("fail")}
const isCorrect=await bcrypt.compare(pass,p.pass)
if(!isCorrect){return res.json("fail")}
else
{
    const token=jwt.sign({_id:p.uid},"mysecret")
    
    // console.log(name,uid,token,hashPass)
    res.json({token,name:p.name,pass,uid:p.uid,email:p.email})
   
}

}
catch(e){console.log(e)}
})

app.post("/signup",async(req,res)=>
{   try{
    
    const {name,email,pass}=req.body
    
const p=await playerModel.findOne({email:email})

if(p){console.log(p); return res.json("fail")}
    const uid=uuid();
    const hashPass= await bcrypt.hash(pass,10)
    playerModel.create({name,email,pass:hashPass,uid:uid})

    const token=jwt.sign({_id:uid},"mysecret")
    
    
    res.json({token,name,hashPass,email,uid})
}catch(e){res.json(e)}
})


server.listen(3077,()=>
{
    console.log("server running on 3077")
})