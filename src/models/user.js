const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "Others"].includes(value)){
                throw new Error("Gender data not valid")
            }
        }
    },
    photoUrl :{
        type: String,
        default:"https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
    },
    about: {
        type: String,
        default: "This is a default About of the user"
    },
    skills:{
        type:[String]
    }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);

 