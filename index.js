require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
console.log(process.env);
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});
console.log(process.env);

// Route de test
app.get("/", (req, res) => {
  res.send("Hello depuis le backend !");
});

app.get("/api/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Erreur dans /api/products :", error.message, error.stack);
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
