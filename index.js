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
// const mongoclient = mongodb.MongoClient(URL);


const app = express()

app.use(express.json());

app.use(cors({
    origin : "http://localhost:3000"
}))

app.use(cookieParser())
app.use('/api',auth);
app.use('/api',users);
app.use('/api',videos);
app.use('/api',comments);






app.listen(5000,()=>{
    console.log("connected")
})