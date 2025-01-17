// Ajouter un patient
document.getElementById("form-patient").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await fetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
      headers: { "Content-Type": "application/json" }
    });
    alert("Patient ajouté avec succès !");
    e.target.reset();
  });
  
  // Charger la liste des patients
  document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/patients");
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
  });