const express = require('express')
const env = require("dotenv").config()
const mongodb = require('mongodb')
const URL = process.env.db_URL;
const router = express.Router();
const {DBconnect,closeConnection} = require("../../dbConnect")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const mongoclient =new mongodb.MongoClient(URL);

router.post('/signup',async(req,res)=>{
    try {
    const db =await DBconnect ();
    req.body.timestamps = new Date();
    req.body.subscribers = 0;
    req.body.subscribedUsers = [];
    const hash = await bcrypt.hash(req.body.password , 10);
    req.body.password = hash;
    const user =await db.collection("users").insertOne(req.body);
    await closeConnection();
    res.send("added")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.post('/signin',async(req,res)=>{
    try {
    const db =await DBconnect ();
    const user = await db.collection("users").findOne({email : req.body.email})
    console.log(user);
    const { password, ...others }=user
    if(user){
        const compare = await bcrypt.compare(req.body.password , user.password);
        if (compare) {
            const token = await jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:"24h"})
            // console.log(token)
            // res.cookie("accessToken",token,{
            //     httpOnly:true
            // }).json(others)
            res.json({message:"success",others,token})
        } else {
            res.status(404).send("Incorrect Mail/Password")
        }
    }
    else{
        res.status(404).send("Incorrect Mail/Password")
    }
        
    await closeConnection();
    
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


router.post('/signout',async(req,res)=>{
    try {
    await res.clearCookie('accessToken')
    localStorage.clear()
    res.send("signed Out")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})



router.get('/users',async(req,res)=>{
    try {
    const db =await DBconnect ();  
    const user =await db.collection("users").findOne({email: req.body.email});
    await closeConnection();
    res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


module.exports = router 