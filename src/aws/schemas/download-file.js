const Joi = require("joi");
const S3ObjectAcl = require("../constants");

module.exports = Joi
    .object()
    .keys({
        bucket          : Joi.string().required(),
        key             : Joi.string().required(),
        fileName        : Joi.string().required(),
        maxSize         : Joi.number().required(),
        expireInHour    : Joi.alternatives().when(
                            'expireInMin',
                            {
                                is: true, then: Joi.any().optional(),
                                otherwise: Joi.number().required()
                            }),
        expireInMin     : Joi.number().optional(),
        acl             : Joi.string().valid(S3ObjectAcl.S3ObjectAcl).required()
    });
