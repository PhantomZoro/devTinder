const express = require('express');
const connectDB = require('./config/database');

const app = express();
const User = require("./models/user");

app.use(express.json());

//Add a user to database
app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save(); //Returns a promise
        res.send("User has been added successfully")
    } catch (err) {
        res.status(400).send("Error adding user to the database")
    }
    
})

//Get user by email 
app.get("/user", async (req, res) =>{
    //console.log(req.body.emailId)
    const userEmail = req.body.emailId;

    try {
        const user = await User.find({emailId: userEmail});
        if(user.length === 0){
            res.status(400).send("user not found")
        }
        res.send(user)
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

//FEED API - Get all the users
app.get("/feed", async (req, res) =>{
    try {
        const user = await User.find({});
        if(user.length === 0){
            res.status(400).send("user not found")
        }
        res.send(user)
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Delete a user from database
app.delete("/user", async (req, res)=>{

    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("Deleted user")
    }catch (err) {
        res.status(400).send("Something went wrong")
    }
})

//Update data of the user
app.patch("/user", async (req, res)=>{
    const data = req.body;
    const userId = req.body.userId;
    console.log(data)
    try{
        await User.findByIdAndUpdate(userId, data);
        res.send("User updated successfully")
    } catch(err){
        res.status(400).send("Something went wrong")
    }
})

connectDB()
    .then(() =>{
        console.log("Database connection established");

        app.listen(3000, ()=>{
        console.log("Server is successfully listening on port 3000")
        });
    })
    .catch((err) =>{
        console.error("Database cannot be connected")
});

