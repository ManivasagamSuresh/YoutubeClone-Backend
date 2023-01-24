const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization
    if(token){
        const verify = jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                res.status(401).send('UnAuthorized');
            }
            req.user = user;  /////////used is various places..
            next();
        })
        
    }else{
        res.status(401).send('UnAuthorized');
    }
}

module.exports = {verifyToken};