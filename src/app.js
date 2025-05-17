const express = require('express');

const app = express();

app.use(
    "/user", 
    (req, res, next)=>{
        //Route Handler 1
        next();
        //res.send("Response from Handler 1");
    },
    (req, res) =>{
        //Route Handler 2
        res.send("Response from handler 2")
    }        
)

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000")
});