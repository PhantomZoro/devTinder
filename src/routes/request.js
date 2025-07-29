const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//Send connection request route
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) =>{
    const user = req.user;
    console.log("Sending connection request");

    res.send(user.firstName + " Sent the connection request")
})

module.exports = requestRouter;