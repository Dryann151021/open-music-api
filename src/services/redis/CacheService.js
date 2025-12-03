class CacheService {
  constructor(client) {
    this._client = client;
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  del(key) {
    this._client.del(key);
  }
}

module.exports = CacheService;
