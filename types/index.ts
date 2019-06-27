import { Document } from "mongoose";

export interface IUser {
    name?: string;
    email?: string;
    password?: string;

    avatar?: string;
}

export interface IUserMongooseData extends IUser, Document {}

export interface IExtendedUser extends IUser {
    password2?: string;
}

export interface IValidationResponse {
    errors?: { [key: string]: string };
    isValid: boolean;
}
