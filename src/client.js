const amqp = require("amqplib");
require("dotenv").config();

const operations = ["add", "sub", "mul", "div", "all"];

async function generateRandomOperation() {
  const n1 = Math.floor(Math.random() * 100);
  const n2 = Math.floor(Math.random() * 100);
  const operation = operations[Math.floor(Math.random() * operations.length)];

  return {
    n1,
    n2,
    operation,
  };
}

async function sendOperation() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME, {
      durable: true,
    });

    setInterval(async () => {
      const operation = await generateRandomOperation();
      channel.sendToQueue(
        process.env.QUEUE_NAME,
        Buffer.from(JSON.stringify(operation))
      );
      console.log("Opération envoyée:", operation);
    }, 5000);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

sendOperation();
