import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/estr2106-g2");

const db = mongoose.connection;

db.on("error", () => {
    console.error("Connection failed");
    throw new Error("Connection failed");
});

export { db };
