// Ajouter un patient
document.getElementById("form-patient").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    // Envoi des données à l'API pour ajouter le patient
    await fetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
      headers: { "Content-Type": "application/json" }
    });

    alert("Patient ajouté avec succès !");
    e.target.reset(); // Réinitialiser le formulaire
    
    // Charger à nouveau la liste des patients après l'ajout
    loadPatients();
});

// Charger la liste des patients
document.addEventListener("DOMContentLoaded", loadPatients);

async function loadPatients() {
    const response = await fetch("/api/patients");
    if (response.ok) {
        const patients = await response.json();
        const list = document.getElementById("patients-list");
        list.innerHTML = patients
            .map(
                (p) => `
                <tr>
                    <td>${p.idPatient}</td>
                    <td>${p.Nom}</td>
                    <td>${p.Prenom}</td>
                    <td>${p.Age}</td>
                    <td>${p.Tel}</td>
                    <td>${p.Nationalite}</td>
                    <td>
                        <button onclick="editPatient(${p.idPatient})">Modifier</button>
                        <button onclick="deletePatient(${p.idPatient})">Supprimer</button>
                    </td>
                </tr>`
            )
            .join("");
    } else {
        alert("Erreur de chargement des patients !");
    }
}

// Fonction pour supprimer un patient
async function deletePatient(idPatient) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
        const response = await fetch(`/api/patients/${idPatient}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Patient supprimé avec succès !");
            loadPatients(); // Recharger la liste des patients
        } else {
            alert("Erreur de suppression du patient !");
        }
    }
}

// Fonction pour modifier les données d'un patient
async function editPatient(idPatient) {
    // Afficher le formulaire de modification
    document.getElementById("edit-form-container").style.display = "block";
    
    // Récupérer les données du patient
    const response = await fetch(`/api/patients/${idPatient}`);
    const patient = await response.json();
    
    // Remplir le formulaire de modification avec les données du patient
    document.getElementById("edit-idPatient").value = patient.idPatient;
    document.getElementById("edit-nom").value = patient.Nom;
    document.getElementById("edit-prenom").value = patient.Prenom;
    document.getElementById("edit-age").value = patient.Age;
    document.getElementById("edit-tel").value = patient.Tel;
    document.getElementById("edit-nationalite").value = patient.Nationalite;
}

// Fonction pour annuler la modification
function cancelEdit() {
    document.getElementById("edit-form-container").style.display = "none";
}

// Modifier les données du patient
document.getElementById("edit-patient-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const idPatient = data.get("idPatient");

    // Envoi des nouvelles données du patient à l'API
    await fetch(`/api/patients/${idPatient}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json" }
    });

    alert("Patient modifié avec succès !");
    loadPatients(); // Recharger la liste des patients
    cancelEdit(); // Cacher le formulaire de modification
});
