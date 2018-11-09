const Joi = require("joi");
const S3Object = require("../constants");

module.exports = Joi
    .object()
    .keys({
        Bucket: Joi.string().required(),
        Key: Joi.string().required(),
        ACL: Joi.string().valid(S3Object.S3ObjectAcl).required(),
    });
