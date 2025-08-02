const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {

        fromUserId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User" // reference to User collection
        },
        toUserId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        status:{
            type: String,
            required:true,
            enum: {
                values: ["ignored", "accepted", "interested", "rejected"],
                message: `{VALUE} is not supported`
            }
        }

    },
    {   
        timestamps: true
    }
);

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;
    //Check if fromUserId is same as the toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})

connectionRequestSchema.index({toUserId: 1, fromUserId: 1});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel;