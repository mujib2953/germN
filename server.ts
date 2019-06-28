import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";

import configurePassport from "./config/passport";
import * as UserRoute from "./routes/api/User";
import { logg, loggError } from "./util/GlobalError";

// --- initialize configuration environment
dotenv.config();

// --- All constants
const app: express.Application = express();
const PORT: number = parseInt(process.env.SERVER_PORT, 10) || 5000;
const DB_LINK: string = process.env.MONGO_URI || "";

// --- All middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(
    bodyParser.json()
);
app.use(
    passport.initialize()
);
configurePassport(passport);

// --- Routes
app.use(
    "/api/users", UserRoute.default
);

logg(`Connecting to mongo db : ${DB_LINK}`);

mongoose.connect(DB_LINK, {
    useNewUrlParser: true
})
    .then(() => {
        logg(`Connected to mongo database.`);
    })
    .catch((error) => {
        loggError(error);
    });

app.get("/", (req, res) => {
    res.send("Happy coding...");
});

app.listen(PORT, () => {
    logg(`Local server is running on port : ${PORT}`);
});
