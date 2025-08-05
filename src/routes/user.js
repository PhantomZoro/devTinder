const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connnectionRequest");
const User = require("../models/user")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

//Get all the pending connection request for the loggedInUser
userRouter.get("/user/requests/received", userAuth, async (req, res)=>{

    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:  "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully", 
            data: connectionRequests,
        })

    }catch(err){
        req.statusCode(400).send("ERROR:" +err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) =>{
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        //We just want data of the persons with whom the connection is there 

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        }); 
        res.json(data);

    }catch(err){
        res.status(400).send("ERROR:", +err.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) =>{
    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        // skip = (page - 1) * limit;
        const skip = (page - 1 )* limit;

        //Find all the connection requests sent or received 
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId  toUserId").populate("fromUserId", "firstName").populate("toUserId", "firstName")

        //Make list of all the users who need to be hidden 
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach( req =>{
            hideUsersFromFeed.add(req.fromUserId._id.toString());
            hideUsersFromFeed.add(req.toUserId._id.toString());
        })

        //Now get all the people except for the hidden users
        const users = await User.find({
            $and:[{_id: {$nin: Array.from(hideUsersFromFeed)}}, //Whose ids are not in this array
                {_id: {$ne: loggedInUser._id}} //Not equal to loggedInUser id 
            ]  
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(users);

    }catch(err){
        res.status(400).json({message : err.message});
    }
})

module.exports = userRouter;