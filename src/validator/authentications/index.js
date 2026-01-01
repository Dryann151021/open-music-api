const {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} = require('./schema');

const InvariantError = require('../../exception/InvariantError');

const authenticationValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validateResult = postAuthenticationPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validateResult = putAuthenticationPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validateResult = deleteAuthenticationPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = authenticationValidator;
