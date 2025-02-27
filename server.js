// Ajout des modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// Fixation du port
const PORT = 3000;

// Configuration de la connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_patients' // Nom de ta base de données
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
app.use(express.static('public')); // Dossier contenant les fichiers HTML, CSS, JS
// Route pour ajouter un dossier médical
app.post('/api/dossiers', (req, res) => {
    const { idPatient } = req.body;
    const dateCreation = new Date().toISOString().slice(0, 10); // Date actuelle au format AAAA-MM-JJ

    // Vérifier si l'ID Patient existe
    db.query('SELECT idPatient FROM patients WHERE idPatient = ?', [idPatient], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Erreur de base de données', error: err });
        }

        if (result.length === 0) {
            return res.status(400).send({ message: 'Le patient avec cet ID n\'existe pas' });
        }

        // Inserer le dossier
        db.query('INSERT INTO dossiers (dateCreation, idPatient) VALUES (?, ?)', [dateCreation, idPatient], (error, results) => {
            if (error) {
                return res.status(500).send({ message: 'Erreur lors de l\'ajout du dossier', error: error });
            }
            res.status(200).json({ message: 'Dossier médical ajouté avec succès!', results });
        });
    });
});

// Route pour enregistrer les patients
app.post('/api/patients', (req, res) => {
    const { nom, prenom, age, tel, nationalite } = req.body;

    const query = 'INSERT INTO patients (Nom, Prenom, Age, Tel, Nationalite) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nom, prenom, age, tel, nationalite], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ message: 'Patient enregistré avec succès!', results });
    });
});

// Route pour récupérer la liste des patients
app.get('/api/patients', (req, res) => {
    const query = 'SELECT * FROM patients';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results); // Renvoyer la liste des patients en JSON
    });
});

// Route principale pour afficher la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Accueil.html')); // Nouveau fichier HTML à afficher
});

// Route pour afficher ListePatient.html
app.get('/patients', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ListePatient.html'));
});

// Route pour afficher ListeDossier.html
app.get('/dossiers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ListeDossier.html'));
});
// Route pour récupérer un patient par son ID (pour remplir le formulaire de modification)
app.get('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM patients WHERE idPatient = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results[0]);
    });
});

// Route pour mettre à jour un patient
app.put('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const { nom, prenom, age, tel, nationalite } = req.body;
    
    const query = 'UPDATE patients SET Nom = ?, Prenom = ?, Age = ?, Tel = ?, Nationalite = ? WHERE idPatient = ?';
    db.query(query, [nom, prenom, age, tel, nationalite, id], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ message: 'Patient mis à jour avec succès!' });
    });
});


// Route pour ajouter un dossier médical
app.post('/api/dossiers', (req, res) => {
    const { idPatient } = req.body;
    const dateCreation = new Date().toISOString().slice(0, 10); // Date actuelle au format AAAA-MM-JJ

    const query = 'INSERT INTO dossiers (dateCreation, idPatient) VALUES (?, ?)';
    db.query(query, [dateCreation, idPatient], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ message: 'Dossier médical ajouté avec succès!', results });
    });
});

// Route pour récupérer les dossiers médicaux
app.get('/api/dossiers', (req, res) => {
    const query = `
        SELECT dossiers.idDossier, dossiers.dateCreation, patients.Nom, patients.Prenom 
        FROM dossiers
        JOIN patients ON dossiers.idPatient = patients.idPatient
    `;
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results); // Renvoyer la liste des dossiers avec infos patients
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
