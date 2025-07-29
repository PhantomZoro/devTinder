const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connnectionRequest');
const User = require('../models/user');

//Send connection request route (Either interesetd or ignored NOT accepted)
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) =>{

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({"message":"Invalid status type"})
        }



        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({"message":"User does not exist"})
        }
        
        //IF there is an already existing connection request 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {  fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection request already exists"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName+" is "+status+" in "+toUser.firstName,
            data
        })

    } catch(err){
        res.status(400).send("ERROR:" +err.message);
    }
})

module.exports = requestRouter;