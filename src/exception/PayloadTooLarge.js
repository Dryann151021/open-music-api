const ClientError = require('./ClientError');

class PayloadTooLarge extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'PayloadTooLarge';
    this.statusCode = 413;
  }
}

module.exports = PayloadTooLarge;
