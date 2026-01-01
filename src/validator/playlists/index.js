const InvariantError = require('../../exception/InvariantError');
const {
  postPlaylistPayloadSchema,
  postSongOnPlaylistPayloadSchema,
} = require('./schema');

const playlistValidator = {
  validatePlaylistPayload: (payload) => {
    const validateResult = postPlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateSongOnPlaylistPayload: (payload) => {
    const validateResult = postSongOnPlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = playlistValidator;
