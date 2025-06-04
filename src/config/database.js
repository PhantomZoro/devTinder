const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://phaneendrab_4545:Manoj_mongodb2809@namastenode.p6zwfzi.mongodb.net/devTinder"
    );
}

module.exports = connectDB;