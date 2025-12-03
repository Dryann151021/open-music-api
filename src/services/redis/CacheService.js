class CacheService {
  constructor(client) {
    this._client = client;
    this._client.on('error', (error) => {
      console.log(error);
    });
    this._client.connect();
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
