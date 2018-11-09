const Joi = require('joi');
const Util = require('util');
const aws = require('aws-sdk');
const Config = require('config');

aws.config.update({
  accessKeyId: Config.aws.accessKey,
  secretAccessKey: Config.aws.accessSecret,
});

const s3 = new aws.S3();

exports.uploadUrl = async (data) => {
  return new Promise((resolve, reject) => {
    Joi.validate(data, require('./schemas/upload-file'), function (err, params) {
      if (err) reject(err);

      s3.getSignedUrl('putObject', params, (err, endpoint) => {
        if (err) reject(err);
        resolve({endpoint});
      });
    });
  });
};

exports.downloadUrl = async (data) => {
};
