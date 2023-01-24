const express = require('express')
const env = require("dotenv").config()
const cors = require("cors")
const mongodb = require('mongodb')
const URL = process.env.db_URL;
const router = express.Router();
const {DBconnect,closeConnection} = require("../dbConnect")
const {verifyToken}=require("../verify")

const mongoclient =new mongodb.MongoClient(URL);


router.put('/updateuser/:id',verifyToken,async(req,res)=>{
    
    if(req.params.id===req.user._id){
        try {
            const db =await DBconnect ();
                const user = await db.collection("users").findOne({_id:mongodb.ObjectId(req.params.id)})
                // req.body.subscribers = user.subscribers;
                // req.body.subscribedUsers = user.subscribedUsers;
                // req.body.timestamps = new Date();             
                const Updateduser = await db.collection("users").updateOne({_id:mongodb.ObjectId(req.params.id)},{$set:req.body});    
            
            
            res.status(201).send(Updateduser);
            await closeConnection();
            
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
    }else{
        res.status(401).send("Unauthorized")
    }
    
})

router.delete('/deleteuser/:id',verifyToken,async(req,res)=>{
    if(req.params.id===req.user._id){
    try {
    const db =await DBconnect ();
    
    await db.collection("users").deleteOne({_id:mongodb.ObjectId(req.params.id)});

    await closeConnection();
    res.send("Deleted")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}else{
    res.status(401).send("Unauthorized")
}

})

router.get('/findUser/:id',async(req,res)=>{
    try {
    const db =await DBconnect ();  
    const user =await db.collection("users").findOne({_id:mongodb.ObjectId(req.params.id)});
    await closeConnection();
    res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})




router.put('/sub/:id',verifyToken,async(req,res)=>{
    
    try {
    const db =await DBconnect ();
    const user =await db.collection("users").updateOne({_id:mongodb.ObjectId(req.user._id)},{$push : {subscribedUsers:req.params.id}});
    const subs =await db.collection("users").updateOne({_id:mongodb.ObjectId(req.params.id)},{$inc : {subscribers:1}});

    await closeConnection();
    res.status(201).send("Subscribtion Successfully");
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }


})

router.put('/unsub/:id',verifyToken,async(req,res)=>{
    
        try {
        const db =await DBconnect ();
        const user =await db.collection("users").updateOne({_id:mongodb.ObjectId(req.user._id)},{$pull : {subscribedUsers:req.params.id}});
        const subs =await db.collection("users").updateOne({_id:mongodb.ObjectId(req.params.id)},{$inc : {subscribers: -1}});
    
        await closeConnection();
        res.status(201).send("Unsubscribtion Successfully");
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
   
    
})

router.put('/like/:videoId',verifyToken,async(req,res)=>{
    try {
        const id = req.user._id;
        // const videoId = req.params.id;
    const db =await DBconnect ();   
    const subs =await db.collection("video").updateOne({_id:mongodb.ObjectId(req.params.videoId)},{
        $addToSet:{likes : id}, //make sure the id does not duplicates in array
        $pull :{dislikes : id}  
    });

    await closeConnection();
    res.send("liked")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.put('/dislike/:videoId',verifyToken,async(req,res)=>{
    try {
        const id = req.user._id;
        // const videoId = req.params.id;
    const db =await DBconnect ();   
    const subs =await db.collection("video").updateOne({_id:mongodb.ObjectId(req.params.videoId)},{
        $addToSet:{dislikes : id},
        $pull :{likes : id}  
    });

    await closeConnection();
    res.send("vdo disliked")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})





module.exports = router