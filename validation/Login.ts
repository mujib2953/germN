import Validator from "validator";

import messages from "../data/messages";
import { IUser, IValidationResponse } from "../types";
import isEmpty from "./IsEmpty";

const validateLoginInput = (data: IUser): IValidationResponse => {
    const errors: { [key: string]: string } = {};

    const duplicateUser: IUser = {...data};

    duplicateUser.email = !isEmpty(duplicateUser.email) ? duplicateUser.email : "";
    duplicateUser.password = !isEmpty(duplicateUser.password) ? duplicateUser.password : "";

    if (Validator.isEmpty(duplicateUser.email)) {
        errors.email = messages.EN.EMAIL_REQ_ERROR;
    }

    if (!Validator.isEmail(duplicateUser.email)) {
        errors.email = messages.EN.EMAIL_INVALID_ERROR;
    }

    if (Validator.isEmpty(duplicateUser.password)) {
        errors.password = messages.EN.PASSWORD_REQ_ERROR;
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

export default validateLoginInput;
