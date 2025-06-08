const express = require('express');
const connectDB = require('./config/database');
const { validateSignUpData } = require("./utils/validation") 
const bcrypt = require("bcrypt");

const app = express();
const User = require("./models/user");

app.use(express.json());

//Add a user to database
app.post("/signup", async (req, res) => {

    try {
        //Validation of data 
        validateSignUpData(req);

        //Encrypt the password 
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log("Password hash" + passwordHash);

        //Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save(); //Returns a promise
        res.send("User has been added successfully")
    } catch (err) {
        res.status(400).send("ERROR: "+ err.message)
    }
    
})

//Login 
app.post("/login", async (req, res) =>{
   try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if(isPasswordValid){
            res.send("User has been logged in successfully")
        } else {
            throw new Error("Invalid Credentials");
        }

        
    } catch (err) {
        res.status(400).send("ERROR: "+ err.message)
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
        res.status(400).send("Something went wrong" + err.message)
    }
})

//FEED API - Get all the users
app.get("/feed", async (req, res) =>{
    try {
        const user = await User.find({});
        if(user.length === 0){
            res.status(400).send("No users found")
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
app.patch("/user/:userId", async (req, res)=>{
    const data = req.body;
    const userId = req.params?.userId;

   try{
        const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age","skills"]

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed) {
            res.status(400).send("Update not allowed");
        }

        await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        });
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

