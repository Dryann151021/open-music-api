const InvariantError = require('../../exception/InvariantError');
const { albumPayloadSchema, ImageHeadersSchema } = require('./schema');

const albumValidator = {
  validateAlbumPayload: (payload) => {
    const validateResult = albumPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = albumValidator;
