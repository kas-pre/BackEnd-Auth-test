//Validation
const Joi = require('joi');
//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object().keys({
        //name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;