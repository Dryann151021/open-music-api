const exportPlaylistsPayloadSchema = require('./schema');
const InvariantError = require('../../exception/InvariantError');

const exportValidator = {
  validateExportPayload: (payload) => {
    const validateResult = exportPlaylistsPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = exportValidator;
