const express = require("express");
const app = express();

const cors = require("cors");
const db = require("./models");

// ======================
// Configuration CORS
// ======================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Synchronisation BDD
// ======================
// Utilise force:true uniquement la première fois.
// Ensuite remplace par sync() pour éviter de supprimer les données.
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée.");
  })
  .catch((err) => {
    console.error("Erreur de synchronisation :", err.message);
  });

// ======================
// Route de test
// ======================
app.get("/", (req, res) => {
  res.json({ message: "Supertte application." });
});

// ======================
// Routes
// ======================
app.use("/api/categories", require("./routes/categorie.routes"));
app.use("/api/produits", require("./routes/produit.routes"));
app.use("/api/ventes", require("./routes/vente.routes"));
// ======================
// Lancement du serveur
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});