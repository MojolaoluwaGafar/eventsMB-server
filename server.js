require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")
const mongoose = require("mongoose")
const userAuthRouter = require("./routes/userAuthRouter")
const eventRouter = require("./routes/eventRouter")

app.use(express.json())
app.use(cors())

//test route
app.get("/", (req,res)=>{
    res.status(200).json({success : true, message:"MB events server"})
});

app.use("/api/user/auth",userAuthRouter)
app.use("/api/user/events",eventRouter)


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        app.listen(process.env.PORT, ()=>{
            console.log(`Server running on port : ${process.env.PORT}`);      
        })
    } catch (error) {
      console.log(error);
        
    }
}
startServer()

//error route
app.use((req,res)=>{
    res.status(401).json({success: false, message: "ROUTE NOT FOUND" })
})