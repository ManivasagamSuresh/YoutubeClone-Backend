const express = require('express')
const app = express()
const env = require("dotenv").config()
const cors = require("cors")
const mongodb = require('mongodb')
const URL = process.env.db_URL;
const users = require('./Routes/users')
const videos = require('./Routes/videos')
const comments = require('./Routes/comments')
const auth = require('./Routes/auth/auth')
const  cookieParser =require('cookie-parser')
// const mongoclient = mongodb.MongoClient(URL);
const mongoose = require('mongoose');


const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1543306",
  key: "2cb807ac9e27dee80bb7",
  secret: "7fefdd827e1a269d72e1",
  cluster: "ap2",
  useTLS: true,
  enabledTransports: ['ws', 'wss']
});



app.use(express.json());

// app.use(cors({
//     origin : "http://localhost:3000"
// }))



app.use(cors({
    origin : "https://jocular-vacherin-dcbf9f.netlify.app"
}))




  mongoose.connect(URL);
  const db = mongoose.connection;
  db.once('open',()=>{
    console.log("connetcted")
    const commentCollection = db.collection("comments");
    const changeStream = commentCollection.watch();
    console.log('watch')
    changeStream.on('change',(change)=>{
      console.log(change)  
      if(change.operationType ==="insert"){
                
            const comDetails = change.fullDocument;
            pusher.trigger("comments", "inserted",comDetails)
            }else{
                    console.log('not expected event to trigger')
        }
    })
  })

app.use(cookieParser())
app.use('/api',auth);
app.use('/api',users);
app.use('/api',videos);
app.use('/api',comments);






app.listen(process.env.PORT || 5000,()=>{
    console.log("connected")
})