import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/laDisqueriaDB");

const connection = mongoose.connection;
connection.once("open", () =>{
    console.log("Db is open")
});

connection.on("disconnected" , () =>{
    console.log("DB is disconnected")
});

connection.on("error" , (error) =>{
    console.log("error found" + error)
});


