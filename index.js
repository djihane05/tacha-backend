require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Route POST pour recevoir le formulaire de contact
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Vérifie que les champs sont remplis
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Tous les champs sont requis" });
  }

  // Crée un transporteur SMTP avec Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Contenu de l'email
  const mailOptions = {
    from: email, // l'adresse de l'expéditeur
    to: process.env.EMAIL_USER, // ton email pour recevoir le message
    subject: "Nouveau message de contact",
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    // Envoie l'email
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de l'envoi du message." });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
