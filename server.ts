import dotenv from "dotenv";
import express from "express";

// initialize configuration
dotenv.config();

const app: express.Application = express();
const PORT: number = parseInt(process.env.SERVER_PORT, 10) || 5000;

app.get("/", (req, res) => {
    res.send("Happy coding...");
});

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Local server is running on port : ${PORT}`);
});
