import { useState } from "react";
import axios from "axios";
import Side from "../components/Side";
import Navbar from "../components/Navbar";
import BarcodeScanner from "../components/BarcodeScanner";

function Sales() {

  const [scannerVisible, setScannerVisible] = useState(false);

  const [panier, setPanier] = useState([]);

  const [modePaiement, setModePaiement] = useState("Espèces");

  const rechercherProduit = (code) => {

    axios
      .get(`http://localhost:5000/api/produits/barcode/${code}`)

      .then((res) => {

        const produit = res.data;

        const existe = panier.find(
          (p) => p.id === produit.id
        );

        if (existe) {

          setPanier(
            panier.map((p) =>
              p.id === produit.id
                ? {
                    ...p,
                    quantite: p.quantite + 1,
                  }
                : p
            )
          );

        } else {

          setPanier([
            ...panier,
            {
              id: produit.id,
              nom: produit.nom,
              prix: produit.prixVente,
              quantite: 1,
            },
          ]);

        }

      })

      .catch(() => {

        alert("Produit introuvable");

      });

  };

  const total = panier.reduce(
    (somme, p) => somme + p.prix * p.quantite,
    0
  );

  return (

    <div className="d-flex">

      <Side />

      <div className="flex-grow-1">

        <Navbar />

        <div className="container mt-4">

          <h2>Nouvelle Vente</h2>

          <button
            className="btn btn-success mb-3"
            onClick={() => setScannerVisible(true)}
          >
            Scanner un produit
          </button>

          {scannerVisible && (
            <BarcodeScanner
              onScan={rechercherProduit}
            />
          )}

          <table className="table table-bordered">

            <thead>

              <tr>

                <th>Produit</th>
                <th>Prix</th>
                <th>Qté</th>
                <th>Total</th>

              </tr>

            </thead>

            <tbody>

              {panier.map((p) => (

                <tr key={p.id}>

                  <td>{p.nom}</td>

                  <td>{p.prix} DA</td>

                  <td>{p.quantite}</td>

                  <td>{p.prix * p.quantite} DA</td>

                </tr>

              ))}

            </tbody>

          </table>

          <h3>Total : {total} DA</h3>

          <select
            className="form-select mb-3"
            value={modePaiement}
            onChange={(e) =>
              setModePaiement(e.target.value)
            }
          >
            <option>Espèces</option>
            <option>Carte Bancaire</option>
          </select>

          <button
            className="btn btn-primary"
          >
            Valider la vente
          </button>

        </div>

      </div>

    </div>

  );

}

export default Sales;