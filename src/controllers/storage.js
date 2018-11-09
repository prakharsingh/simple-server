const Joi = require('joi');
const Config = require("config");
const Boom = require('boom');
const SignedUrl = require("../aws/s3-signed-url");

module.exports = [
  {
    path: "/api/storage/s3/signed-url/{acl}",
    method: "GET",
    config: {
      validate: {
        params: {
          acl: Joi.string().valid(['private', 'public-read']).default('public-read')
        },
        query: {
          key: Joi.string().required(),
        }
      },
      handler: async (request) => {
        try {
          const s3Params = {
            Bucket: Config.aws.s3.bucket,
            Key: request.query.key,
            ACL: request.params.acl,
          };

          const data = await SignedUrl.uploadUrl(s3Params);

          if(!data) return Boom.internal();

          return data;
        }
        catch (error) {
          request.server.log('error', '---UNHANDLED ERROR---' + error.toString());
          return Boom.internal();
        }
      }
    }
  },

  {
    path: "/api/storage/s3/download/{acl}",
    method: "GET",
    handler: function (request, reply) {
      'use strict';

      const data = {
        bucket: Config.aws.s3.bucket,
        key: request.query.key,
        maxSize: 10,
        expireInMin: 1,
        acl: request.params.acl,
        fileName: request.query.name
      };

      SignedUrl
        .downloadUrl(Config.aws.accessKey, Config.aws.accessSecret, data, false)
        .then(function (url) {
          reply({
            url: url,
            id: request.params.id
          });
        });
    }
  }
];
