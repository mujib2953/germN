import { genSalt, hash } from "bcrypt";
import express from "express";
import gravatar from "gravatar";
import { Document } from "mongoose";

import messages from "../../data/messages";
import User from "../../models/User";
import validateRegisterInput from "../../validation/Register";

const router = express.Router();

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
 * Type    : GET
 * Routes  : api/users/test
 * Desc    : To test the user route is working.
 * Access  : Public
 * Params  : N/A
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
        .then((user: Document) => {
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

                                const newUser: Document = new User({
                                    avatar,
                                    email: req.body.email,
                                    name: req.body.name,
                                    password: hashCode,
                                });

                                newUser
                                    .save()
                                    .then((savedUser) => {
                                        res.json(savedUser);

                                        // tslint:disable-next-line:no-console
                                        console.log(`New User created with email: ${req.body.email}`);
                                    })
                                    .catch((error) => {
                                        // tslint:disable-next-line:no-console
                                        console.error(error);
                                    });
                            })
                            .catch((error) => {
                                // tslint:disable-next-line:no-console
                                console.error(error);
                            });
                    })
                    .catch((error) => {
                        // tslint:disable-next-line:no-console
                        console.error(error);
                    });
            }
        })
        .catch((error) => {
            // tslint:disable-next-line:no-console
            console.error(error);
        });

});

export default router;
