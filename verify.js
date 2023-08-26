const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization
    // console.log(token);
    if(token){
        const verify = jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                res.status(401).send('NotValid');
                console.log("UnAuthorized err")
            }
            req.user = user;  /////////used is various places..
            next();
        })
        
    }else{
        res.status(401).send('UnAuthorized');
        console.log('no')
    }
}


const verifyTokenPut = (req,res,next)=>{
    const token = req.body.headers.authorization
    console.log(req.body.headers.authorization);
    if(token){
        const verify = jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                res.status(401).send('UnAuthorized err');
                console.log("UnAuthorized err")
            }
            req.user = user;  /////////used is various places..
            console.log(user)
            next();
        })
        
    }else{
        res.status(401).send('UnAuthorized');
        console.log(req.body.headers);
    }
}



module.exports = {verifyToken,verifyTokenPut};