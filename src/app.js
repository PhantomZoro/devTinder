const express = require('express');

const app = express();

app.use("/test", (req, res) =>{
    res.send("Hello from test route server")
});

//Handle only get calls
app.get("/user", (req, res) =>{
    res.send({
        firstName: "Phaneendra", 
        secondName:"Bheesetti"
    })
})

//Handle only POST calls 
app.post("/user", (req, res) =>{
    //Saving data to db 
    res.send("Data successfully saved to database")
})

//Handle only delete calls
app.delete("/user", (req, res) =>{
    //Deleting a user 
    res.send("Deleted a user from database")
} )

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000")
});