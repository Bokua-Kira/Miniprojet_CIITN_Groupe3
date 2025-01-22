// Ajouter un dossier
document.getElementById("form-dossier").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  // Envoi des données à l'API pour ajouter le dossier
  await fetch("/api/dossiers", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(data)),
    headers: { "Content-Type": "application/json" },
  });
  alert("Dossier ajouté avec succès !");
  e.target.reset(); // Réinitialiser le formulaire
  
  // Charger à nouveau la liste des dossiers après l'ajout
  loadDossiers();
});

// Charger la liste des dossiers
document.addEventListener("DOMContentLoaded", loadDossiers);

async function loadDossiers() {
  const response = await fetch("/api/dossiers");
  if (response.ok) {
    const dossiers = await response.json();
    const list = document.getElementById("dossiers-list");
    list.innerHTML = dossiers
      .map(
        (d) => `
        <tr>
          <td>${d.idDossier}</td>
          <td>${new Date(d.dateCreation).toLocaleDateString("fr-FR")}</td>
          <td>${d.Nom}</td>
          <td>${d.Prenom}</td>
          <td>
            <button onclick="editDossier(${d.idDossier})">Modifier</button>
            <button onclick="deleteDossier(${d.idDossier})">Supprimer</button>
          </td>
        </tr>`
      )
      .join("");
  } else {
    alert("Erreur de chargement des dossiers !");
  }
}

// Fonction pour supprimer un dossier
async function deleteDossier(idDossier) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
    const response = await fetch(`/api/dossiers/${idDossier}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Dossier supprimé avec succès !");
      loadDossiers(); // Recharger la liste des dossiers
    } else {
      alert("Erreur de suppression du dossier !");
    }
  }
}

// Fonction pour modifier les données d'un dossier
async function editDossier(idDossier) {
  // Afficher le formulaire de modification
  document.getElementById("edit-form-container").style.display = "block";

  // Récupérer les données du dossier
  const response = await fetch(`/api/dossiers/${idDossier}`);
  const dossier = await response.json();

  // Remplir le formulaire de modification avec les données du dossier
  document.getElementById("edit-idDossier").value = dossier.idDossier;
  document.getElementById("edit-dateCreation").value = dossier.dateCreation.slice(0, 10); // Format YYYY-MM-DD
  document.getElementById("edit-idPatient").value = dossier.idPatient;
}

// Fonction pour annuler la modification
function cancelEdit() {
  document.getElementById("edit-form-container").style.display = "none";
}

// Modifier les données du dossier
document.getElementById("edit-dossier-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idDossier = data.get("idDossier");

  // Envoi des nouvelles données du dossier à l'API
  await fetch(`/api/dossiers/${idDossier}`, {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(data)),
    headers: { "Content-Type": "application/json" },
  });

  alert("Dossier modifié avec succès !");
  loadDossiers(); // Recharger la liste des dossiers
  cancelEdit(); // Cacher le formulaire de modification
});
