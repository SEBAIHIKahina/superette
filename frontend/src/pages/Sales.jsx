import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

import Side from "../components/Side";
import Navbar from "../components/Navbar";
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

    axios
      .get("http://localhost:5000/api/produits")
      .then((res) => {

        setProduits(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

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

    axios
      .get(
        `http://localhost:5000/api/produits/barcode/${code}`
      )

      .then((res) => {

        ajouterAuPanier(res.data);

        setScannerVisible(false);

      })

      .catch(() => {

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

  axios
    .post("http://localhost:5000/api/ventes", {
      produits,
      modePaiement,
    })
    .then((res) => {
      alert(res.data.message);

      imprimerTicket();

      setPanier([]);
    })
    .catch((err) => {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Erreur lors de la vente"
      );
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

    (somme, p) =>

      somme + p.prix * p.quantite,

    0

  );

  const monnaie =

    Number(montantRecu || 0) - total;


  return (

    <div className="d-flex">

      <Side />

      <div className="flex-grow-1">

        <Navbar />

<div className="container mt-4">
<h2 className="mb-4">🛒 Nouvelle Vente</h2>

<div className="card shadow-sm mb-4">

  <div className="card-body">

    <div className="row g-3">

      {/* Recherche */}
      <div className="col-lg-8">

        <label className="form-label">
          Rechercher un produit
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Nom du produit..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        {recherche !== "" && (

          <div
            className="list-group position-absolute"
            style={{
              width: "45%",
              zIndex: 1000
            }}
          >

            {produits
              .filter((p) =>
                p.nom
                  .toLowerCase()
                  .includes(recherche.toLowerCase())
              )
              .slice(0,5)
              .map((p)=>(

                <button
                  key={p.id}
                  className="list-group-item list-group-item-action"
                  onClick={()=>{
                    ajouterAuPanier(p);
                    setRecherche("");
                  }}
                >
                  {p.nom} - {p.prixVente} DA
                </button>

              ))}

          </div>

        )}

      </div>

      {/* Scanner */}
      <div className="col-lg-4 d-grid">

        <label className="form-label">
          Scanner
        </label>

        <button
          className="btn btn-success"
          onClick={() => setScannerVisible(true)}
        >
          📷 Scanner un produit
        </button>

      </div>

    </div>

    {scannerVisible && (

      <div className="mt-3">

        <BarcodeScanner onScan={rechercherProduit} />

      </div>

    )}

  </div>

</div>

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
          onChange={(e)=>setDescriptionLibre(e.target.value)}
        />

      </div>

      <div className="col-md-3">

        <input
          type="number"
          className="form-control"
          placeholder="Prix"
          value={prixLibre}
          onChange={(e)=>setPrixLibre(e.target.value)}
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
          <div className="row">

  <div className="col-md-4">

    <label>Montant reçu</label>

    <input
      type="number"
      className="form-control"
      value={montantRecu}
      onChange={(e) =>
        setMontantRecu(e.target.value)
      }
    />

  </div>

  <div className="col-md-4">

    <label>Monnaie</label>

    <input
      className="form-control"
      value={monnaie >= 0 ? monnaie : 0}
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
      <div style={{ display: "none" }}>

  <div ref={ticketRef}>

    <h2 style={{ textAlign: "center" }}>
      SUPERETTE
    </h2>

    <hr />

    {panier.map((p) => (

      <div
        key={p.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span>
          {p.nom} x {p.quantite}
        </span>

        <span>
          {p.prix * p.quantite} DA
        </span>

      </div>

    ))}

    <hr />

    <h3>Total : {total} DA</h3>

    <p>Mode : {modePaiement}</p>

    <p>
      Date :
      {" "}
      {new Date().toLocaleString()}
    </p>

    <br />

    <p style={{ textAlign: "center" }}>
      Merci pour votre visite
    </p>

  </div>

</div>
    </div>

  );

}

export default Sales;