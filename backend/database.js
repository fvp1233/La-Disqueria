import mongoose from "mongoose";
import { config } from "../backend/config.js";

mongoose.connect(config.DB_URI);

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


