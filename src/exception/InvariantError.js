const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.statusName = 'InvariantError';
  }
}

module.exports = InvariantError;
