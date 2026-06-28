import { useState } from "react";
import Side from "../components/Side";
import Navbar from "../components/Navbar";
import CategorieService from "../services/categorie.service";

function Categories() {
  const [nom, setNom] = useState("");
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const onlyNumbersRegex = /^\d+$/;

    if (!nom.trim()) {
      alert("Le nom de la catégorie est obligatoire.");
      return;
    }

    if (onlyNumbersRegex.test(nom.trim())) {
      alert("Le nom ne doit pas contenir uniquement des chiffres.");
      return;
    }

    try {
      const res = await CategorieService.createCategorie(nom);

      const { status, message, categorie } = res.data;

      if (status === "created" || status === "reactivated") {
        setCategories((prev) => [
          ...prev.filter((c) => c.nom !== categorie.nom),
          categorie,
        ]);

        alert(message);

        setNom("");
      } else if (status === "exists") {
        alert(message);
      } else {
        alert("Erreur inconnue.");
      }
    } catch (err) {
      console.error("Erreur complète :", err);

      if (err.response) {
        console.log("Status :", err.response.status);
        console.log("Data :", err.response.data);
      }

      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <h2 className="mb-4">Gestion des catégories</h2>

          {/* Formulaire d'ajout */}
          <div className="card shadow p-4 mb-4">
            <h4 className="mb-3">Ajouter une catégorie</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Nom de la catégorie
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Saisir le nom de la catégorie"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Ajouter
              </button>
            </form>
          </div>

          {/* Tableau */}
          <div className="card shadow p-4">
            <h4 className="mb-3">Liste des catégories</h4>

            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>État</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td>{cat.nom}</td>
                      <td>
                        {cat.etat ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            Désactivée
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Aucune catégorie disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;