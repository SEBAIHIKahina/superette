import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ProductService from "../services/produit.service";
import SalesService from "../services/vente.service";

import BarcodeScanner from "../components/BarcodeScanner";


function Sales() {

  // =============================
  // Etats
  // =============================

  const [scannerVisible, setScannerVisible] = useState(false);

  const [produits, setProduits] = useState([]);

  const [panier, setPanier] = useState([]);

  const [recherche, setRecherche] = useState("");

  const [descriptionLibre, setDescriptionLibre] = useState("");

  const [prixLibre, setPrixLibre] = useState("");

  const [modePaiement, setModePaiement] = useState("Espèces");

  const [montantRecu, setMontantRecu] = useState("");

  const ticketRef = useRef();

  // =============================
  // Impression
  // =============================
  const [produitSelectionne, setProduitSelectionne] = useState("");
  const imprimerTicket = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: "Ticket",
  });

  // =============================
  // Charger les produits
  // =============================

  useEffect(() => {
    chargerProduits();
  }, []);



  const ajouterProduitManuel = () => {

    if (!produitSelectionne) {
      alert("Sélectionnez un produit");
      return;
    }

    const produit = produits.find(
      (p) => p.id == produitSelectionne
    );

    if (!produit) return;

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

    setProduitSelectionne("");

  };

  const chargerProduits = () => {

    ProductService.getAll()
      .then((res) => setProduits(res.data))
      .catch((err) => console.log(err));

  };

  // =============================
  // Ajouter au panier
  // =============================

  const ajouterAuPanier = (produit) => {

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

  };

  // =============================
  // Scanner
  // =============================

 const rechercherProduit = (code) => {
  console.log("CODE SCANNÉ :", code);

  ProductService.getByBarcode(code)
    .then((res) => {
      console.log("PRODUIT TROUVÉ :", res.data);
      ajouterAuPanier(res.data);
      setScannerVisible(false);
    })
    .catch((err) => {
      console.log("ERREUR SCAN :", err.response?.data || err);
      alert("Produit introuvable");
    });
};

  // =============================
  // Produit libre
  // =============================

  const ajouterProduitLibre = () => {

    if (
      descriptionLibre === "" ||
      prixLibre === ""
    ) {
      return;
    }

    setPanier([
      ...panier,
      {
        id: Date.now(),
        nom: descriptionLibre,
        prix: Number(prixLibre),
        quantite: 1,
        libre: true,
      },
    ]);

    setDescriptionLibre("");

    setPrixLibre("");

  };

  // =============================
  // Quantité +
  // =============================
  const validerVente = () => {

    if (panier.length === 0) {
      alert("Le panier est vide.");
      return;
    }

    const produits = panier.map((p) => ({
      produitId: p.id,
      quantite: p.quantite,
    }));

    SalesService.create({
      produits,
      modePaiement,
    })
      .then((res) => {
        alert(res.data.message);
        imprimerTicket();
        setPanier([]);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Erreur vente");
      });

  };
  const augmenter = (id) => {

    setPanier(
      panier.map((p) =>
        p.id === id
          ? {
            ...p,
            quantite: p.quantite + 1,
          }
          : p
      )
    );

  };

  // =============================
  // Quantité -
  // =============================

  const diminuer = (id) => {

    setPanier(
      panier
        .map((p) =>
          p.id === id
            ? {
              ...p,
              quantite: p.quantite - 1,
            }
            : p
        )
        .filter((p) => p.quantite > 0)
    );

  };

  // =============================
  // Supprimer
  // =============================

  const supprimer = (id) => {

    setPanier(
      panier.filter((p) => p.id !== id)
    );

  };

  // =============================
  // Total
  // =============================
const total = panier.reduce(
  (somme, p) => somme + p.prix * p.quantite,
  0
);

const montant = Number(montantRecu || 0);

const monnaie = montant > total ? montant - total : 0;

  return (

    <div className="d-flex">

     
      <div className="flex-grow-1">

        

        <div className="container mt-4">
          <h2 className="mb-4">🛒 Nouvelle Vente</h2>


          <div className="card shadow-sm mb-4">

            <div className="card-header">
              Vente libre
            </div>

            <div className="card-body">

              <div className="row g-3">

                <div className="col-md-6">

                  <input
                    className="form-control"
                    placeholder="Description"
                    value={descriptionLibre}
                    onChange={(e) => setDescriptionLibre(e.target.value)}
                  />

                </div>

                <div className="col-md-3">

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Prix"
                    value={prixLibre}
                    onChange={(e) => setPrixLibre(e.target.value)}
                  />

                </div>

                <div className="col-md-3 d-grid">

                  <button
                    className="btn btn-primary"
                    onClick={ajouterProduitLibre}
                  >
                    Ajouter
                  </button>

                </div>

              </div>

            </div>



          </div>
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
                <th>Actions</th>
                <th>Produit</th>
                <th>Prix</th>
                <th>Qté</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              {panier.map((p) => (

                <tr key={p.id}>
                  <td>

                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={() => augmenter(p.id)}
                    >
                      +
                    </button>

                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => diminuer(p.id)}
                    >
                      -
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => supprimer(p.id)}
                    >
                      🗑
                    </button>

                  </td>
                  <td>{p.nom}</td>

                  <td>{p.prix} DA</td>

                  <td>{p.quantite}</td>

                  <td>{p.prix * p.quantite} DA</td>

                </tr>

              ))}

            </tbody>

          </table>

          <h3>Total : {total} DA</h3>
          
          

          
          <div className="row">

            <div className="col-md-4">

              <label>Montant reçu</label>

             <input
  type="number"
  className="form-control"
  value={montantRecu}
  onChange={(e) => setMontantRecu(e.target.value)}
  placeholder="Montant reçu"
/>

            </div>

            <div className="col-md-4">

              <label>Monnaie</label>

              <input
  className="form-control"
  value={monnaie}
  readOnly
/>

            </div>

          </div>
  
          <button
            className="btn btn-primary"
            onClick={validerVente}
          >
            Valider la vente
          </button>

        </div>

      </div>
      <div
  style={{
    position: "fixed",
    left: "-9999px",
    top: 0,
  }}
>

       <div
  ref={ticketRef}
  style={{
    width: "300px",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    color: "#000",
  }}
>

  {/* Header */}
  <div style={{ textAlign: "center", marginBottom: 10 }}>
    <h2 style={{ margin: 0 }}>SUPERETTE</h2>
    <p style={{ margin: 0, fontSize: 12 }}>
      Vente de produits alimentaires
    </p>
  </div>

  <hr />

  {/* Produits */}
  <div>
    {panier.map((p) => (
      <div
        key={p.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ maxWidth: "60%" }}>
          {p.nom} x{p.quantite}
        </span>

        <span>
          {p.prix * p.quantite} DA
        </span>
      </div>
    ))}
  </div>

  <hr />

  {/* Totaux */}
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <strong>Total :</strong>
      <strong>{total} DA</strong>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Mode :</span>
      <span>{modePaiement}</span>
    </div>

    {montantRecu && (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Reçu :</span>
        <span>{montantRecu} DA</span>
      </div>
    )}

    {montantRecu && (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Monnaie :</span>
        <span>{monnaie} DA</span>
      </div>
    )}
  </div>

  <hr />

  {/* Date */}
  <div style={{ textAlign: "center", fontSize: 12 }}>
    <p style={{ margin: 0 }}>
      {new Date().toLocaleString()}
    </p>
  </div>

  {/* Footer */}
  <div style={{ textAlign: "center", marginTop: 10 }}>
    <strong>Merci pour votre visite 🙏</strong>
  </div>

</div>

      </div>
    </div>

  );

}

export default Sales;