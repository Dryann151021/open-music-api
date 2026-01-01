const InvariantError = require('../../exception/InvariantError');
const { userPayloadSchema } = require('./schema');

const userValidator = {
  validateUserPayload: (payload) => {
    const validateResult = userPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = userValidator;
