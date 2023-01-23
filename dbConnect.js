
const mongodb = require('mongodb')
const URL = process.env.db_URL;
let db;
let connection;



const mongoclient =new mongodb.MongoClient(URL);

async function DBconnect (){
    try {
        const connection =  await mongoclient.connect();
        const db = connection.db('youtubeClone');
        return db ;   
    } catch (error) {
        console.log(error)
    }
    
}

const closeConnection=async ()=>{
    if(connection){
        await connection.close();
    }else{
        console.log("No Connection")
    }
}

module.exports = { DBconnect , db , connection , closeConnection} 