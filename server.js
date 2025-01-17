//Ajout des modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
//Fixation du port²
const PORT = 3000;

// Configuration de la connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});
// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données: ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données avec l\'ID ' + db.threadId);
});
// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route pour enregistrer les données
app.post('/api/client', (req, res) => {
    const { prenom, nom } = req.body;

    const query = 'INSERT INTO client (prenom, nom) VALUES (?, ?)';
    db.query(query, [prenom, nom], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ message: 'Utilisateur enregistré avec succès!', results });
    });
});

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulaire.html'));
});

// Route pour récupérer la liste des utilisateurs
app.get('/api/clients', (req, res) => {
    const query = 'SELECT prenom, nom FROM client';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results); // Renvoyer la liste des utilisateurs en JSON
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
