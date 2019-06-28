import dotenv from "dotenv";
import mongoose from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";

import { logg, loggError } from "../util/GlobalError";

// --- initialize configuration environment
dotenv.config();

const SECRET_PASSPORT_KEY = process.env.PASSPORT_KEY || undefined;
const OPTION = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_PASSPORT_KEY
};

logg(`We are using secret Key: ${SECRET_PASSPORT_KEY}`);

const configurePassport = (passport: any) => {
    passport.use(
        new Strategy(OPTION, (jwtPayload, done) => {
            const UserModel = mongoose.model("user");

            UserModel.findById(jwtPayload.id)
                .then((user) => {
                    if (user !== undefined) {
                        return done(null, user);
                    }

                    return done(null, false);
                })
                .catch((error) => {
                    loggError(error);
                });
        })
    );
};

export default configurePassport;
