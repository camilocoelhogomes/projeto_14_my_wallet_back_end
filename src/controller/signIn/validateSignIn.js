import Joi from 'joi';

const siginInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/),
})

export default siginInSchema;