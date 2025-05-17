const express = require('express');

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user/getAllData", userAuth, (req, res) =>{
    //Logic for getting all data 
    res.send("All data sent"); 
    
});

app.get("/admin/getAllData", (req, res) =>{
    //Logic for getting all data 
    res.send("All data sent"); 
    
});

app.get("/admin/deleteUser", (req, res) =>{
    //Logic for deleting data
    res.send("Deleted a user")
})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000")
});