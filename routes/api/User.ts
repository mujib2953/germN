import { compare, genSalt, hash } from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import gravatar from "gravatar";
import { sign } from "jsonwebtoken";

import messages from "../../data/messages";
import User from "../../models/User";
import { IUserMongooseData } from "../../types";
import { logg, loggError } from "../../util/GlobalError";
import validateLoginInput from "../../validation/Login";
import validateRegisterInput from "../../validation/Register";

// --- initialize configuration environment
dotenv.config();

const router = express.Router();
const SECRET_PASSPORT_KEY = process.env.PASSPORT_KEY || undefined;

/************************************************************
 * Type    : GET
 * Routes  : api/users/test
 * Desc    : To test the user route is working.
 * Access  : Public
 * Params  : N/A
************************************************************* */
router.get("/test", (req, res) =>
    res.json({
        msg: "Users works"
    })
);

/************************************************************
 * Type    : POST
 * Routes  : api/users/register
 * Desc    : To Register user to application
 * Access  : Public
 * Params  : {name: string, email: string, password: string, password2: string}
 ************************************************************* */
router.post("/register", (req, res) => {
    // --- validating user inputs
    const validationResponse = validateRegisterInput(req.body);

    if (!validationResponse.isValid) {
        return res.status(400).json(validationResponse.errors);
    }

    User.findOne({
        email: req.body.email,
    })
        .then((user: IUserMongooseData) => {
            if (user !== null) {
                // --- Found User with given email-id

                const errors: { [key: string]: string } = {};
                errors.email = messages.EN.EMAIL_EXIST_ERROR;

                return res.status(400).json(errors);

            } else {
                // --- New user has arrived o_0 Yippee..

                // --- Creating default avatar for new user
                const avatar: string = gravatar.url(req.body.email, {
                    default: "mm",
                    rating: "pg",
                    size: "200",
                });

                genSalt(10)
                    .then((salt: string) => {

                        hash(req.body.password, salt)
                            .then((hashCode: string) => {

                                const newUser: IUserMongooseData = new User({
                                    avatar,
                                    email: req.body.email,
                                    name: req.body.name,
                                    password: hashCode,
                                });

                                newUser
                                    .save()
                                    .then((savedUser) => {
                                        res.json(savedUser);
                                        logg(`New User created with email: ${req.body.email}`);
                                    })
                                    .catch((error) => {
                                        loggError(error);
                                    });
                            })
                            .catch((error) => {
                                loggError(error);
                            });
                    })
                    .catch((error) => {
                        loggError(error);
                    });
            }
        })
        .catch((error) => {
            loggError(error);
        });
});

/************************************************************
 * Type    : POST
 * Routes  : api/users/login
 * Desc    : To Login user into application
 * Access  : Public
 * Params  : {email: string, password: string}
 ************************************************************* */
router.post("/login", (req, res) => {

    const validateResponse = validateLoginInput(req.body);
    const {email, password} = req.body;

    const errors: { [key: string]: string; } = {};
    if (!validateResponse.isValid) {
        res.status(400).json(validateResponse.errors);
    }

    User.findOne({
        email,
    })
        .then((searchedUser: IUserMongooseData) => {
            if (searchedUser === null || searchedUser === undefined) {
                // --- Not found
                errors.email = messages.EN.NO_SUCH_USER;
                return res.status(400).json(errors);
            }

            compare(password, searchedUser.password)
                .then((isMatched: boolean) => {
                    if (isMatched) {

                        const jwtPayload = {
                            avatar: searchedUser.avatar,
                            id: searchedUser.id,
                            name: searchedUser.name,
                        };

                        sign(jwtPayload, SECRET_PASSPORT_KEY, {expiresIn: 3600}, (error, token: string) => {
                            if (error !== undefined && error !== null) {
                                loggError(error);
                            } else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });

                    } else {
                        errors.password = messages.EN.PASSWORD_INCORRECT_ERROR;
                        res.status(400).json(errors);
                    }
                })
                .catch((error) => {
                    loggError(error);
                });
        })
        .catch((error) => {
            loggError(error);
        });
});
export default router;
