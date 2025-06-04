const amqp = require("amqplib");
require("dotenv").config();

async function startResultClient() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.RESULT_QUEUE, {
      durable: true,
    });

    console.log("Client de résultats démarré");

    channel.consume(process.env.RESULT_QUEUE, (msg) => {
      if (msg !== null) {
        const result = JSON.parse(msg.content.toString());
        console.log("Résultat reçu:", result);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

startResultClient();
