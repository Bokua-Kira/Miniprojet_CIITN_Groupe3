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
                </tr>`
            )
            .join("");
    } else {
        alert("Erreur de chargement des patients !");
    }
}
