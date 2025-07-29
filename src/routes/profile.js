const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

//Get profile of the user 
profileRouter.get("/profile", userAuth, async (req, res) =>{

    try{        
        const user = req.user;
        if(!user){
            throw new Error
        }
        
        res.send(user);
    } catch(err){
        
    }

})

//Edit the profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) =>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit request")
        };

        const loggedInUser = req.user;

        Object.keys(req.body).forEach( (key) => loggedInUser[key] = req.body[key] )

        //Save the changes to the database
        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your profile has been updated successfully`);
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
    
})

module.exports = profileRouter;