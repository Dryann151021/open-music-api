const amqp = require('amqplib');

// config environment
const { config } = require('../../config');
const rabbitmq = config.rabbitmq;

const ProduserService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(rabbitmq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProduserService;
