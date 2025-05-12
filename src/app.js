const express = require('express');

const app = express();

app.use("/", (req, res) =>{
    res.send("Hello from server direct")
});

app.use("/test", (req, res) =>{
    res.send("Hello from test route server")
});

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000")
});