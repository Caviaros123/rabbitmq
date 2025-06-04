const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const amqp = require("amqplib");
require("dotenv").config();

// Configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Système de Calcul Distribué",
    description:
      "Interface de visualisation du système de calcul distribué avec RabbitMQ",
  });
});

// Connexion RabbitMQ
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.RESULT_QUEUE, {
      durable: true,
    });

    // Consommation des résultats
    channel.consume(process.env.RESULT_QUEUE, (msg) => {
      if (msg !== null) {
        const result = JSON.parse(msg.content.toString());
        io.emit("newResult", result);
        channel.ack(msg);
      }
    });

    console.log("Connecté à RabbitMQ");
  } catch (error) {
    console.error("Erreur de connexion à RabbitMQ:", error);
  }
}

// Socket.IO
io.on("connection", (socket) => {
  console.log("Un client est connecté");

  socket.on("disconnect", () => {
    console.log("Un client est déconnecté");
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  connectRabbitMQ();
});
