# Open Music API

Open Music API adalah sebuah layanan RESTful API untuk pengelolaan musik digital. Proyek ini dibangun menggunakan Node.js dengan framework Hapi.

## Fitur Utama

- **Pengelolaan Lagu**: Menambahkan, mengubah, menampilkan, dan menghapus lagu.
- **Playlist**: Membuat dan mengelola daftar putar lagu.
- **Authentication**: Sistem registrasi dan login pengguna menggunakan JWT.
- **Export**: Fitur ekspor daftar putar menggunakan Message Broker (RabbitMQ).
- **Caching**: Fitur caching data menggunakan Redis.

## Tech Stack

- [Node.js](https://nodejs.org/)
- [Hapi](https://hapi.dev/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Relational DBMS
- [Redis](https://redis.io/) - In-memory data storage untuk caching
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate) - Database migration

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (v14 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [RabbitMQ](https://www.rabbitmq.com/)

## Instalasi

1.  **Clone repositori ini:**

    ```bash
    git clone https://github.com/Dryann151021/open-music-api.git
    cd open-music-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # atau jika menggunakan pnpm
    pnpm install
    ```

## Konfigurasi

Buat file `.env` di direktori utama proyek dan sesuaikan konfigurasi berikut dengan lingkungan development Anda:

```env
# Server configuration
HOST=localhost
PORT=5000

# PostgreSQL configuration
PGUSER=developer
PGHOST=localhost
PGPASSWORD=supersecretpassword
PGDATABASE=openmusic
PGPORT=5432

# JWT configuration
ACCESS_TOKEN_KEY=access_token_secret_key
REFRESH_TOKEN_KEY=refresh_token_secret_key
ACCESS_TOKEN_AGE=1800

# Message broker configuration (RabbitMQ)
RABBITMQ_SERVICE=amqp://localhost

# Caching configuration (Redis)
REDIS_SERVER=localhost
```

## Database Migration

Jalankan perintah berikut untuk membuat tabel-tabel yang diperlukan di database PostgreSQL:

```bash
npm run migrate up
```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode development:

```bash
npm run dev
```

Untuk menjalankan aplikasi dalam mode production:

```bash
npm start
```

## Linting

Untuk memeriksa kode menggunakan ESLint:

```bash
npm run lint
```
