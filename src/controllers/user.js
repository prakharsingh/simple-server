const Joi = require('joi');

module.exports = [
  {
    path: "/api/submit",
    method: "POST",
    config: {
      validate: {
        payload: {
          category: Joi.string(),
          categoryType: Joi.string().allow(['new', 'existing']),
          busNameEng: Joi.string(),
          busNameArab: Joi.string(),
          branchNameEng: Joi.string(),
          branchNameArab: Joi.string(),
          location: Joi.string().required(),
          city: Joi.string().required(),
          country: Joi.string().required(),
          instaUrl: Joi.string(),
          fbUrl: Joi.string(),
          about: Joi.string(),
          email: Joi.string().email(),
          phone: Joi.string(),
          membership: Joi.string().allow(['category1', 'category2']).required(),
          profilePicUrl: Joi.string(),
        },
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error('ValidationError:', err.message);
            throw Boom.badRequest(`Invalid request payload input`);
          } else {
            // During development, log and respond with the full error.
            console.error(err);
            throw err;
          }
        }
      },
      handler: async (request) => {
        try{
          return request.payload;
        } catch(error) {
          request.server.log('error', '---UNHANDLED ERROR---' + error.toString());
          return Boom.internal();
        }
      }
    }
  }
];
