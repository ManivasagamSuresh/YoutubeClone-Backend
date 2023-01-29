const express = require('express')
const env = require("dotenv").config()
const cors = require("cors")
const mongodb = require('mongodb')
const URL = process.env.db_URL;
var router = express.Router();
const {DBconnect,closeConnection} = require("../dbConnect");
const { verifyToken } = require('../verify');

const mongoclient =new mongodb.MongoClient(URL);

router.post('/addvideo',verifyToken,async(req,res)=>{
   
    try {
    
    const db =await DBconnect ();
    req.body.timestamps = new Date();
    req.body.views = 0
    req.body.tags = [];
    req.body.likes = [];
    req.body.dislikes = [];
    
    const video =await db.collection("video").insertOne({userId:mongodb.ObjectId(req.user._id), ...req.body});
    
    await closeConnection();
    res.status(202).send(video)
    } catch (error) {
        res.status(500).send('internal server error')
    }


})


router.put('/updatevideo/:id',verifyToken,async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
    const video = await db.collection("video").findOne({_id: mongodb.ObjectId(req.params.id)});
    if(!video){res.status(404).send("Video Not Found")}
      if(req.user._id===video.userId){
        var updatedVideo =await db.collection("video").updateOne({_id: mongodb.ObjectId(req.params.id)},{$set: req.body});
      }else{
        res.status(401).send("Unauthorized")
      }
    
    await closeConnection();
    res.status(201).send(updatedVideo);
    } catch (error) {
        res.status(500).send('internal server error')
    }


})

router.delete('/deletevideo/:id',verifyToken,async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
    const video = await db.collection("video").findOne({_id: mongodb.ObjectId(req.params.id)});
    if(!video){res.status(404).send("Video Not Found")}
      if(req.user._id===video.userId){
        const deleteVideo =await db.collection("video").deleteOne({_id: mongodb.ObjectId(req.params.id)});    
      }else{
        res.status(401).send("Unauthorized")
      }
    
    
    
    await closeConnection();
    res.send("Video Deleted")
    } catch (error) {
        res.status(500).send('internal server error')
    }


})

router.get('/findvideo/:id',verifyToken,async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
       
    const videos =await db.collection("video").findOne({_id: mongodb.ObjectId(req.params.id)});
    
    await closeConnection();
    res.send(videos)
    } catch (error) {
        res.status(500).send('internal server error')
    }


})

router.put('/videoViews/:id',verifyToken,async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
        
    const views =await db.collection("video").updateOne({_id: mongodb.ObjectId(req.params.id)},{$inc:{views : 1}});
    
    await closeConnection();
    res.send("views has been increased")
    } catch (error) {
        res.status(500).send('internal server error')
    }


})


router.get('/trendvideo',verifyToken,async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
    const user =await db.collection("video").find().sort({views : -1}).toArray(); /// if 1 then it will give in ascending order
    
    await closeConnection();
    res.send(user);
    } catch (error) {
        res.status(500).send('internal server error')
    }


})


router.get('/randomvideos',async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
    
    const Randomvideos =await db.collection("video").aggregate([{$sample:{ size : 40}}]).toArray();
    // aggregate method to display random data
    await closeConnection();
    res.status(200).send(Randomvideos)
    console.log(Randomvideos);
    } catch (error) {
        res.status(500).send('internal server error')
    }


})


router.get('/subscribedVideo',verifyToken,async(req,res)=>{
    
    try {
    // console.log(req.user)
    const db =await DBconnect ();
   const user = await db.collection("users").findOne({_id:mongodb.ObjectId(req.user._id)});
        // console.log(user);
   const subscribeduser = user.subscribedUsers;
 
   const lists =await  Promise.all(  //to return all the return data as one data
    subscribeduser.map(async(channelID)=>{
        const vdo = await  db.collection("video").find({userId:mongodb.ObjectId(channelID)}).toArray();
        return vdo;
    })
   )

    await closeConnection();
    res.json(lists.flat().sort((a,b)=>b.timestamps-a.timestamps)); //if not flat ,then nested array formed
    } catch (error) {
        console.log(error);
        res.status(500).send('internal server error')
    }

})


router.get('/tags',verifyToken,async(req,res)=>{
    
    try {
    
    const db =await DBconnect ();
    const tags = req.query.tags.split(",");
    
    const tagvideos =await db.collection("video").find({tags:{$in:tags}}).limit(20).toArray();
    // aggregate method to display random data
    await closeConnection();
    res.status(200).send(tagvideos)
    } catch (error) {
        res.status(500).send('internal server error')
    }


})

router.get('/search',verifyToken,async(req,res)=>{
    const query = req.query.q;
    try {
    
    const db =await DBconnect ();
    
    const Randomvideos =await db.collection("video").find({title:{$regex:query, $options : "i"}
                                                    }).limit(40).toArray();
    // aggregate method to display random data
    await closeConnection();
    res.status(200).send(Randomvideos)
    } catch (error) {
        res.status(500).send('internal server error')
    }


})



module.exports = router