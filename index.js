require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Pool } = require("pg"); // Ajoute ça pour PostgreSQL

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Route de test
app.get("/", (req, res) => {
  res.send("Hello depuis le backend !");
});

app.get("/api/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error(error); // Ajoute ça pour voir l’erreur
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Message reçu :", { name, email, message });
  res.status(200).json({ success: true, message: "Message bien reçu !" });
});

app.listen(port, () => {
  console.log(`Serveur backend en écoute sur le port ${port}`);
});
