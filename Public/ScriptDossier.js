// Ajouter un dossier
document.getElementById("form-dossier").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await fetch("/api/dossiers", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
      headers: { "Content-Type": "application/json" }
    });
    alert("Dossier ajouté avec succès !");
    e.target.reset();
  });
  
  // Charger la liste des dossiers
  document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/dossiers");
    const dossiers = await response.json();
    const list = document.getElementById("dossiers-list");
    list.innerHTML = dossiers
      .map(
        (d) => `
        <tr>
          <td>${d.idDossier}</td>
          <td>${d.dateCreation}</td>
          <td>${d.idPatient}</td>
        </tr>`
      )
      .join("");
  });