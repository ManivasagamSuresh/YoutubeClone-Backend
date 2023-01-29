const express = require('express')
const env = require("dotenv").config()
const cors = require("cors")
const mongodb = require('mongodb')
const URL = process.env.db_URL;
var router = express.Router();
const {DBconnect,closeConnection} = require("../dbConnect");
const { verifyToken, verifyTokenPut } = require('../verify');

const mongoclient =new mongodb.MongoClient(URL);

router.post('/addcomment',verifyToken,async(req,res)=>{
    try {
    
    const db =await DBconnect ();
    req.body.timestamps = new Date();
    req.body.videoId = mongodb.ObjectId(req.body.videoId);
    const comment =await db.collection("comments").insertOne({...req.body,userId : mongodb.ObjectId(req.user._id)});
    
    await closeConnection();
    res.send("added")
    } catch (error) {
        res.status(500).send('internal server error')
    }
})


router.delete('/deletecomment/:id',verifyToken,async(req,res)=>{
    try {
    
    const db =await DBconnect ();
    const comment = await db.collection('comments').findOne({_id:mongodb.ObjectId(req.params.id)})
    console.log(comment);
    const video = await db.collection('video').findOne({_id:mongodb.ObjectId(comment.videoId)})
    console.log(video);
    
    var id = mongodb.ObjectId(req.user._id);
    // console.log(id)
    VUserId =  video.userId.toString() 
    console.log(VUserId);
    if(req.user._id == comment.userId || req.user._id == VUserId ){
        const deleteComment =await db.collection("comments").deleteOne({_id:mongodb.ObjectId(req.params.id)});
    }else{
      return  res.status(401).send("Unauthorized")
    }
    
    
    await closeConnection();
    res.send("Comment Deleted")
    } catch (error) {
        console.log(error);
        res.status(500).send('internal server error')
    }
})


router.get('/getcomments/:videoId',verifyToken,async(req,res)=>{
    try {
    
    const db =await DBconnect ();    
    const getComments =await db.collection("comments").find({videoId : mongodb.ObjectId(req.params.videoId)}).toArray();
    
    await closeConnection();
    res.status(200).send(getComments)
    } catch (error) {
        res.status(500).send('internal server error')
    }
})




module.exports = router