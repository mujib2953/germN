import dotenv from "dotenv";
import mongoose from "mongoose";
import {ExtractJwt, Strategy} from "passport-jwt";

// --- initialize configuration environment
dotenv.config();

const SECRET_PASSPORT_KEY = process.env.PASSPORT_KEY || undefined;
const OPTION = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_PASSPORT_KEY
};

// tslint:disable-next-line:no-console
console.log(`We are using secret Key: ${SECRET_PASSPORT_KEY}`);

const configurePassport = (passport: any) => {
    passport.use(
        new Strategy(OPTION, (jwtPayload, done) => {
            // tslint:disable-next-line:no-console
            console.log(jwtPayload);

            const UserModel = mongoose.model("user");

            UserModel.findById(jwtPayload.id)
                .then((user) => {
                    if (user !== undefined) {
                        return done(null, user);
                    }

                    return done(null, false);
                })
                .catch((error) => {
                    // tslint:disable-next-line:no-console
                    console.log(error);
                });
        })
    );
};

export default configurePassport;
