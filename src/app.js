const express = require('express');
const connectDB = require('./config/database');
const { validateSignUpData } = require("./utils/validation") 
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth")

const app = express();
const User = require("./models/user");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

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

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){

            //Create JWT Token
            const token = jwt.sign({_id: user._id}, "DEV@Tinder$2809", {
                expiresIn: "1d"
            })
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

//Get profile of the user 
app.get("/profile", userAuth, async (req, res) =>{

    try{        
        const user = req.user;
        if(!user){
            throw new Error
        }
        
        res.send(user);
    } catch(err){
        res.status(400).send("Error: "+ err.message);
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

app.post("/sendConnectionRequest", userAuth, async (req, res) =>{
    const user = req.user;
    console.log("Sending connection request");

    res.send(user.firstName + " Sent the connection request")
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

