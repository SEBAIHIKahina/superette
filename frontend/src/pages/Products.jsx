import { useEffect, useState } from "react";
import ProductService from "../services/produit.service";
import Barcode from "react-barcode";
import Side from "../components/Side";
import Navbar from "../components/Navbar";
import BarcodeScanner from "../components/BarcodeScanner";

function Products() {
  const [produits, setProduits] = useState([]);
  const [scannerVisible, setScannerVisible] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    codeBarre: "",
    prixAchat: "",
    prixVente: "",
    stock: "",
    categorieNom: "",
    etat: true,
  });

  useEffect(() => {
    chargerProduits();
  }, []);

  // Charger produits
  const chargerProduits = () => {
    ProductService.getAll()
      .then((res) => setProduits(res.data))
      .catch((err) => console.log(err));
  };

  // Input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Ajouter produit
  const ajouterProduit = () => {
    ProductService.create(form)
      .then(() => {
        chargerProduits();

        setForm({
          nom: "",
          codeBarre: "",
          prixAchat: "",
          prixVente: "",
          stock: "",
          categorieNom: "",
          etat: true,
        });
      })
      .catch((err) => {
        console.log("Erreur :", err.response?.data);
      });
  };

  // Scanner code-barre
  const rechercherParCodeBarre = (code) => {
    setForm({
      ...form,
      codeBarre: code,
    });

    setScannerVisible(false);
  };

  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <h2>Produits</h2>

          {/* FORM */}
          <div className="card p-3 mb-4">
            <div className="row">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Nom"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Code Barre"
                    name="codeBarre"
                    value={form.codeBarre}
                    readOnly
                  />

                  <button
                    className="btn btn-success"
                    onClick={() => setScannerVisible(true)}
                  >
                    Scanner
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Prix Achat"
                  name="prixAchat"
                  value={form.prixAchat}
                  onChange={handleChange}
                />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Prix Vente"
                  name="prixVente"
                  value={form.prixVente}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Catégorie"
                  name="categorieNom"
                  value={form.categorieNom}
                  onChange={handleChange}
                />
              </div>
            </div>

            <br />

            <button
              className="btn btn-primary"
              onClick={ajouterProduit}
            >
              Ajouter Produit
            </button>
          </div>

          {/* SCANNER */}
          {scannerVisible && (
            <div className="card p-3 mb-3">
              <BarcodeScanner onScan={rechercherParCodeBarre} />

              <button
                className="btn btn-danger mt-3"
                onClick={() => setScannerVisible(false)}
              >
                Fermer
              </button>
            </div>
          )}

          {/* TABLE */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Code Barre</th>
                <th>Image</th>
                <th>Prix Vente</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {produits.map((p) => (
                <tr key={p.id}>
                  <td>{p.nom}</td>
                  <td>{p.codeBarre}</td>
                  <td>
                    <Barcode
                      value={p.codeBarre}
                      width={1}
                      height={40}
                      fontSize={12}
                    />
                  </td>
                  <td>{p.prixVente} DA</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;