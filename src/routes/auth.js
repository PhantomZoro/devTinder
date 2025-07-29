const express = require('express');
const { validateSignUpData } = require("../utils/validation") 
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//Add a user to database
authRouter.post("/signup", async (req, res) => {

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
authRouter.post("/login", async (req, res) =>{
   try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials")
        } 

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            //Create JWT Token
            const token = await user.getJWT();
            console.log(token)
            //Add the token to cookie and send the response back to the user 
            res.cookie("token", token)
            res.send("User has been logged in successfully")
        } else {
            throw new Error("Invalid Credentials");
        }

        
    } catch (err) {
        res.status(400).send("ERROR: "+ err.message)
    } 
})

//Logout
authRouter.post("/logout", async (req, res) =>{
    
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logged out successfully");
})

module.exports = authRouter;