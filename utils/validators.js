let { body, validationResult } = require('express-validator')
let constants = require('./constants')
let utils = require('util')
const { ERROR_EMAIL, ERROR_ROLE, ERROR_PHONENUMBER, ERROR_PASSWORD } = require('./constants')
const { CreateErrorRes } = require('./responseHandler')
let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
}
module.exports = {
    validate: function (req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            CreateErrorRes(res, errors.array(), 500);
        } else {
            next()
        }
    },
    validatorSigup: [
        body("password").isStrongPassword(options.password).withMessage(utils.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        )),
        body("email").isEmail().withMessage(ERROR_EMAIL),
        body("phoneNumber").matches(/^0\d{9}$/).withMessage(ERROR_PHONENUMBER),],
    validatorEdit: [
        body("password").optional().isStrongPassword(options.password).withMessage(utils.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        )),
        body("email").optional().isEmail().withMessage(ERROR_EMAIL),
        body("phoneNumber").optional().matches(/^0\d{9}$/).withMessage(ERROR_PHONENUMBER),],
    validatorChangePassword: [
        body("password").isStrongPassword(options.password).withMessage(utils.format(constants.ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        ))
    ]
}
