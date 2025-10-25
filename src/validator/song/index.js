const InvariantError = require('../../exception/InvariantError');
const { songPayloadSchema } = require('../schema');

const songValidator = {
  validateSongPayload: (payload) => {
    const validateResult = songPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = songValidator;
