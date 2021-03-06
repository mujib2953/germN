import {model, Schema} from "mongoose";

// --- creating User schema
const UserSchema = new Schema({
    avatar: {
        type: String
    },
    date: {
        default: Date.now,
        type: Date
    },
    email: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});

const User = model("user", UserSchema);
export default User;
