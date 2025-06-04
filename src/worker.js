const amqp = require("amqplib");
require("dotenv").config();

const operation = process.argv[2] || "add";

async function processOperation(data) {
  const { n1, n2 } = data;
  let result;

  switch (operation) {
    case "add":
      result = n1 + n2;
      break;
    case "sub":
      result = n1 - n2;
      break;
    case "mul":
      result = n1 * n2;
      break;
    case "div":
      result = n2 !== 0 ? n1 / n2 : "Division par zéro impossible";
      break;
    default:
      result = "Opération non supportée";
  }

  return {
    n1,
    n2,
    operation,
    result,
  };
}

async function startWorker() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME, {
      durable: true,
    });

    await channel.assertQueue(process.env.RESULT_QUEUE, {
      durable: true,
    });

    console.log(`Worker démarré pour l'opération: ${operation}`);

    channel.consume(process.env.QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        if (data.operation === operation || data.operation === "all") {
          // Simuler un calcul complexe
          const delay = Math.floor(Math.random() * 10000) + 5000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          const result = await processOperation(data);
          channel.sendToQueue(
            process.env.RESULT_QUEUE,
            Buffer.from(JSON.stringify(result))
          );
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

startWorker();
