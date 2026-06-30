import { useEffect, useState } from "react";
import BarcodeInput from "./BarcodeInput";

function ProductModal({
  show,
  onClose,
  onSave,
  editing,
  categories,
  produit,
}) {
  const [form, setForm] = useState({
    nom: "",
    prixVente: "",
    seuilAlerte: 5,
    categorieNom: "",
    image: "",
  });

  const [codesBarres, setCodesBarres] = useState([]);

  useEffect(() => {
    if (editing && produit) {
      setForm({
        nom: produit.nom || "",
        prixVente: produit.prixVente || "",
        seuilAlerte: produit.seuilAlerte || 5,
        categorieNom: produit.categorieNom || "",
        image: produit.image || "",
      });

      setCodesBarres(
        produit.codebarres
          ? produit.codebarres.map((c) => c.code)
          : []
      );
    } else {
      setForm({
        nom: "",
        prixVente: "",
        seuilAlerte: 5,
        categorieNom: "",
        image: "",
      });

      setCodesBarres([]);
    }
  }, [editing, produit, show]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      codesBarres,
    });
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <form onSubmit={handleSubmit}>

            <div className="modal-header">

              <h5 className="modal-title">
                {editing
                  ? "Modifier un produit"
                  : "Ajouter un produit"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />

            </div>

            <div className="modal-body">

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Nom
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Catégorie
                  </label>

                  <select
                    className="form-select"
                    name="categorieNom"
                    value={form.categorieNom}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Choisir...
                    </option>

                    {categories.map((cat) => (
                      <option
                        key={cat.nom}
                        value={cat.nom}
                      >
                        {cat.nom}
                      </option>
                    ))}

                  </select>
                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Prix de vente
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="prixVente"
                    value={form.prixVente}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Seuil d'alerte
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="seuilAlerte"
                    value={form.seuilAlerte}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-12 mb-3">

                  <label className="form-label">
                    Image (URL)
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-12">

                  <BarcodeInput
                    codesBarres={codesBarres}
                    setCodesBarres={setCodesBarres}
                  />

                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                {editing ? "Modifier" : "Ajouter"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ProductModal;