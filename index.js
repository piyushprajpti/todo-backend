import Express from "express";

const express = Express();
const PORT = 8080;

express.get("/signin", (req, res, next) => {
    res.send("response send successfully");
})

express.post("/signup", (req, res, next) => {
    res.send("response send successfully");
})

express.listen(PORT, () => {
    
});