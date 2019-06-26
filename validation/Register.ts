import Validator from "validator";
import messages from "../data/messages";
import { IExtendedUser, IUser, IValidationResponse } from "../types";
import isEmpty from "./IsEmpty";

const validateRegisterInput = (data: IExtendedUser): IValidationResponse => {
    const errors: { [key: string]: string } = {};
    const duplicateUser: IExtendedUser = {...data};

    // --- If data is not provided in request we are setting as empty string
    duplicateUser.name = !isEmpty(duplicateUser.name) ? duplicateUser.name : "";
    duplicateUser.email = !isEmpty(duplicateUser.email) ? duplicateUser.email : "";
    duplicateUser.password = !isEmpty(duplicateUser.password) ? duplicateUser.password : "";
    duplicateUser.password2 = !isEmpty(duplicateUser.password2) ? duplicateUser.password2 : "";

    if (!Validator.isLength(duplicateUser.name, {min: 3, max: 15})) {
        errors.name = messages.EN.NAME_CHAR_RANGE_ERROR;
    }

    if (Validator.isEmpty(duplicateUser.name)) {
        errors.name = messages.EN.NAME_REQ_ERROR;
    }

    if (Validator.isEmpty(duplicateUser.email)) {
        errors.email = messages.EN.EMAIL_REQ_ERROR;
    }

    if (!Validator.isEmail(duplicateUser.email)) {
        errors.email = messages.EN.EMAIL_INVALID_ERROR;
    }

    if (Validator.isEmpty(duplicateUser.password)) {
        errors.password = messages.EN.PASSWORD_REQ_ERROR;
    }

    if (Validator.isEmpty(duplicateUser.password2)) {
        errors.password = messages.EN.PASSWORD_2_REQ_ERROR;
    }

    if (!Validator.isLength(duplicateUser.password, {min: 6, max: 15})) {
        errors.password = messages.EN.PASSWORD_LENGTH_REQ_ERROR;
    }

    if (!Validator.equals(duplicateUser.password, duplicateUser.password2)) {
        errors.password = messages.EN.PASSWORD_NOT_MATCH_ERROR;
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export default validateRegisterInput;
