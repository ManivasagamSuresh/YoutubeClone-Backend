const express = require('express')
const env = require("dotenv").config()
const cors = require("cors")
const mongodb = require('mongodb')
const URL = process.env.db_URL;
const users = require('./Routes/users')
const videos = require('./Routes/videos')
const comments = require('./Routes/comments')
const auth = require('./Routes/auth/auth')
const  cookieParser =require('cookie-parser')
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);





app.use(express.json());

// app.use(cors({
//     origin : "http://localhost:3000"
// }))


// const io = new Server(server,{
//   cors : {
//     origin : "http://localhost:3000",
//     methods : ['GET','POST']
//   }
// })

// app.use(cors({
//   origin : "https://jocular-vacherin-dcbf9f.netlify.app"
// }))


// const io = new Server(server,{
//   cors : {
//     origin : "https://jocular-vacherin-dcbf9f.netlify.app",
//     methods : ['GET','POST']
//   }
// })


app.use(cors({
  origin : "https://videotubeproject.netlify.app"
}))


const io = new Server(server,{
  cors : {
    origin : "https://videotubeproject.netlify.app",
    methods : ['GET','POST']
  }
})



io.on('connection',(socket)=>{
  console.log('user connected',socket.id);
  
  socket.on('addComment',(data)=>{
    console.log("data :",data);
    socket.emit('receiveComment', data)
  })
})





app.use(cookieParser())
app.use('/api',auth);
app.use('/api',users);
app.use('/api',videos);
app.use('/api',comments);






server.listen(process.env.PORT || 5000,()=>{
    console.log("connected")
})