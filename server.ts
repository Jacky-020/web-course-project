import express from "express";
import api from "./src/api";
import ViteExpress from "vite-express";

const PORT = 3000;
const HOST = "localhost";
const app = express();

app.use("/api", api);

ViteExpress.listen(app, PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
