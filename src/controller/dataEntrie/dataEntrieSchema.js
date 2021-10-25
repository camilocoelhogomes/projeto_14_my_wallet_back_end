import Joi from 'joi';

const dataEntrieSchema = Joi.object({
    description: Joi.string().required(),
    contabilType: Joi.string().required(),
    value: Joi.number().required().greater(0),
})

export default dataEntrieSchema;