const Crypto = require('crypto');
const Buffer = require('buffer').Buffer;
const Joi = require('joi');
const Config = require('config');

const BYTES_IN_MB = 1048576;
const ACCESS_SECRET = process.env.ACCESS_SECRET || '';

const signPolicy = (awsSecret, policy) => {
  const policyToSign = Buffer.from(JSON.stringify(policy)).toString('base64');
  const hash = Crypto.createHmac('sha1', awsSecret).update(policyToSign).digest('base64');
  return {
    signature: hash,
    policy: policyToSign
  };
};

const getExpiry = (hours, minutes) => {
  const expires = new Date();

  if (hours) {
    expires.setHours(expires.getHours() + hours);
  }

  if (minutes) {
    expires.setMinutes(expires.getMinutes() + minutes);
  }
  return expires;
};

const uploadFilePolicy = (data) => {
  const expires = data.expireInHour ? data.expireInHour : data.expireInMin;

  return {
    expiration: getExpiry(expires).toISOString(),
    conditions:
      [
        {bucket: data.bucket},
        {acl: data.acl},
        {key: data.key},
        ["starts-with", "$Content-Type", ""],
        ["content-length-range", 0, BYTES_IN_MB * data.maxSize]
      ]
  }

};

exports.uploadUrl = async (data) => {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject("Missing required param(s)");
    }

    Joi.validate(data, require('./schemas/upload-file'), async (err, validData) => {
      if (err) reject(err);
      else {
        const {policy, signature} = await signPolicy(ACCESS_SECRET, uploadFilePolicy(validData));
        resolve({
          host: 'https://s3.amazonaws.com/' + validData.bucket,
          awsKey: Config.aws.accessKey,
          key: validData.key,
          policy: policy,
          signature: signature,
          maxSize: validData.maxSize + 'MB'
        });
      }
    });
  });
};
