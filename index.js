import Express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import auth from "./routes/authentication.js"

const express = Express();
const PORT = 8080;

mongoose.connect("mongodb+srv://piyushoa2004:oA7lIkVdhBDu4Tr0@main.bcfx7zx.mongodb.net/maindb?retryWrites=true&w=majority")
    .then(() => {
        console.log("succesffully connected")
    })
    .catch((e) => {
        console.log(e)

    });

express.use(cors());
express.use(json());
express.get("/", (a, b) => {
    b.send("Good");
})
express.use(auth);

express.listen(PORT, () => {console.log("running server")});