class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.statusName = 'ClientError';
  }
}

module.exports = ClientError;
