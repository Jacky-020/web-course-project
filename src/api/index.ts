import { Router } from "express";
import { db } from "./db";
const api = Router();

db.once("open", async () => {
    console.log("MongoDB Connected!");
});

// will catch all routes not defined
api.use("/*", (req, res) => {
    res.send(`${req.method} ${req.originalUrl} not found`);
});

export default api;
