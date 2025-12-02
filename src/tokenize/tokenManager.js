const Jwt = require('@hapi/jwt');
const InvariantError = require('../exception/InvariantError');

// config envirnment
const { config } = require('../config');
const jwt = config.jwt;

const tokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, jwt.accessToken),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, jwt.refreshToken),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, jwt.refreshToken);
      const { payload } = artifacts.decoded;
      return payload;
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = tokenManager;
