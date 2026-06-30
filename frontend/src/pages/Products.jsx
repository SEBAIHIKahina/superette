import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Side from "../components/Side";
import ProductModal from "../components/ProductModal";
import BarcodeScanner from "../components/BarcodeScanner";
import BarcodePrint from "../components/BarcodePrint";

import produitService from "../services/produit.service";
import categorieService from "../services/categorie.service";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

function Products() {
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [selectedProduit, setSelectedProduit] = useState(null);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  useEffect(() => {
    loadProduits();
    loadCategories();
  }, []);

  const loadProduits = async () => {
    try {
      const res = await produitService.getAll();
      setProduits(res.data.produits);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categorieService.getActive();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditing(false);
    setSelectedId(null);
    setSelectedProduit(null);
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    try {
      const res = await produitService.get(id);

      setEditing(true);
      setSelectedId(id);
      setSelectedProduit(res.data);

      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(false);
    setSelectedProduit(null);
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await produitService.update(selectedId, data);
      } else {
        await produitService.create(data);
      }

      closeModal();
      loadProduits();

    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Désactiver ce produit ?")) return;

    try {
      await produitService.remove(id);
      loadProduits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactivate = async (id) => {
    try {
      await produitService.reactivate(id);
      loadProduits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScan = async (code) => {

    setShowScanner(false);

    setSearch(code);

    try {

      const res = await produitService.getByBarcode(code);

      if (res.data) {

        setSelectedProduit(res.data);

      }

    } catch (err) {
      alert("Produit introuvable.");
    }

  };

  const filteredProduits = produits.filter((p) => {

    const recherche = search.toLowerCase();

    const codeTrouve = p.codebarres?.some((c) =>
      c.code.toLowerCase().includes(recherche)
    );
console.log(produits);
    return (
      p.nom.toLowerCase().includes(recherche) ||
      p.categorieNom.toLowerCase().includes(recherche) ||
      codeTrouve
    );
  });

  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container-fluid mt-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h2>Gestion des Produits</h2>

            <button
              className="btn btn-primary"
              onClick={openCreateModal}
            >
              + Nouveau produit
            </button>

          </div>

          <div className="row mb-3">

            <div className="col-md-8">

              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom, catégorie ou code-barres..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <div className="col-md-4">

              <button
                className="btn btn-success w-100"
                onClick={() => setShowScanner(true)}
              >
                Scanner un code-barres
              </button>

            </div>

          </div>

          <div className="card shadow">

            <div className="card-body">

              <table className="table table-bordered table-hover">

                <thead className="table-dark">

                  <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Etat</th>
                    <th>Codes</th>
                    <th width="280">Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredProduits.length === 0 && (

                    <tr>

                      <td colSpan="6" className="text-center">
                        Aucun produit
                      </td>

                    </tr>

                  )}

                  {filteredProduits.map((produit) => (

                    <tr
                      key={produit.id}
                      className={
                        selectedProduit?.id === produit.id
                          ? "table-warning"
                          : ""
                      }
                    >

                      <td>{produit.nom}</td>

                      <td>{produit.categorieNom}</td>

                      <td>{produit.prixVente} DA</td>

                      <td>{produit.stock}</td>

                      <td>

                        {produit.etat ? (

                          <span className="badge bg-success">
                            Actif
                          </span>

                        ) : (

                          <span className="badge bg-danger">
                            Désactivé
                          </span>

                        )}

                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedCodes(produit.code_barres || []);
                            setSelectedProduit(produit);
                            setShowCodesModal(true);
                          }}
                        >
                          {produit.code_barres?.length || 0} code(s)
                        </button>
                      </td>
                      <td>

                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              openEditModal(produit.id)
                            }
                          >
                            Modifier
                          </button>

                          {produit.etat ? (

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDelete(produit.id)
                              }
                            >
                              Désactiver
                            </button>

                          ) : (

                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleReactivate(produit.id)
                              }
                            >
                              Réactiver
                            </button>

                          )}

                      

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      <ProductModal
        show={showModal}
        onClose={closeModal}
        onSave={handleSave}
        editing={editing}
        produit={selectedProduit}
        categories={categories}
      />

      {showScanner && (

        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,.5)",
          }}
        >

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5>Scanner un code-barres</h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setShowScanner(false)
                  }
                />

              </div>

              <div className="modal-body">

                <BarcodeScanner
                  onScan={handleScan}
                />

              </div>

            </div>

          </div>

        </div>

      )}

      <div style={{ display: "none" }}>

        {selectedProduit && (

          <div ref={printRef}>

            {selectedBarcode && (

            <BarcodePrint
                produit={{
                    ...selectedProduit,
                    codeBarre: selectedBarcode.code,
                }}
            />

)}

          </div>

        )}

      </div>
      {showCodesModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Codes-barres de {selectedProduit?.nom}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowCodesModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                <table className="table table-bordered">

                  <thead>

                    <tr>
                      <th>Code</th>
                      <th width="120">Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {selectedCodes.map((cb) => (

                      <tr key={cb.id}>

                        <td>{cb.code}</td>

                        <td>

                          <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                  setSelectedBarcode(cb);

                                  setTimeout(() => {
                                      handlePrint();
                                  }, 200);
                              }}
                          >
                              Imprimer
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Products;


// import React, { useEffect, useState, useRef } from "react";
// import ProductService from "../services/produit.service";
// import Barcode from "react-barcode";
// import Side from "../components/Side";
// import Navbar from "../components/Navbar";
// import BarcodeScanner from "../components/BarcodeScanner";
// import BarcodePrint from "../components/BarcodePrint";
// import { useReactToPrint } from "react-to-print";
// import { FaEdit, FaTrash, FaPrint, FaBarcode,
//   FaCamera,FaCheckCircle, FaExclamationTriangle, FaTimesCircle  } from "react-icons/fa";
//   import { MdAutoFixHigh } from "react-icons/md";
// function Products() {
//   const [produits, setProduits] = useState([]);
//   const [scannerVisible, setScannerVisible] = useState(false);
//   const [produitImpression, setProduitImpression] = useState(null);

// const printRef = useRef();
//   const barcodeRef = useRef();
//   const [form, setForm] = useState({
//     nom: "",
//     codeBarre: "",
//     prixAchat: "",
//     prixVente: "",
//     stock: "",
//     categorieNom: "",
//     etat: true,
//     seuilAlerte: "",
//   });

//   useEffect(() => {
//     chargerProduits();
//   }, []);

//   // Charger produits
//   const chargerProduits = () => {
//     ProductService.getAll()
//       .then((res) => setProduits(res.data))
//       .catch((err) => console.log(err));
//   };

//   // Input change
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Ajouter produit
//   const enregistrerProduit = () => {

//   if (editingId) {

//     ProductService.update(editingId, form)
//       .then(() => {

//         chargerProduits();

//         setEditingId(null);

//       });

//   } else {

//     ProductService.create(form)
//       .then(() => {

//         chargerProduits();

//       });

//   }

// };

//   // Scanner code-barre
//   const rechercherParCodeBarre = (code) => {
//     setForm({
//       ...form,
//       codeBarre: code,
//     });

//     setScannerVisible(false);
//   };



//   const imprimerCodeBarre = (produit) => {

//   setProduitImpression(produit);

//   setTimeout(() => {
//     imprimer();
//   }, 100);

// };

// const imprimer = useReactToPrint({
//   contentRef: printRef,
//   documentTitle: "Code Barre",
// });
// const genererCodeBarre = () => {

//   const code =
//     "20" +
//     Math.floor(Math.random() * 10000000000)
//       .toString()
//       .padStart(10, "0");

//   setForm({
//     ...form,
//     codeBarre: code,
//   });

// };
// const [editingId, setEditingId] = useState(null);

// const modifierProduit = (produit) => {

//   setEditingId(produit.id);

//   setForm({
//     nom: produit.nom,
//     codeBarre: produit.codeBarre,
//     prixAchat: produit.prixAchat,
//     prixVente: produit.prixVente,
//     stock: produit.stock,
//     categorieNom: produit.categorieNom,
//     seuilAlerte: produit.seuilAlerte,
//     etat: produit.etat,
//   });

// };
// const supprimerProduit = (id) => {

//   if (!window.confirm("Supprimer ce produit ?"))
//     return;

//   ProductService.remove(id)
//     .then(() => chargerProduits());

// };


//   return (
//     <div className="d-flex">
//       <Side />

//       <div className="flex-grow-1 bg-light min-vh-100">
//         <Navbar />

//         <div className="container-fluid py-4 px-lg-4 px-3">
//           <div>

//             <h2 className="fw-bold text-primary mb-1">
//               📦 Gestion des Produits
//             </h2>

            

//           </div>

//          {/* ================= FORMULAIRE ================= */}
// <div className="card shadow-lg border-0 rounded-4 mb-4">
//   <div className="card-header bg-primary text-white py-3">
//     <h5 className="mb-0">
//       {editingId ? "✏ Modifier un produit" : "➕ Ajouter un produit"}
//     </h5>
//   </div>

//   <div className="card-body">

//     <div className="row g-3">

//       {/* Nom */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Nom du produit
//         </label>

//         <input
//           type="text"
//           className="form-control"
//           placeholder="Nom du produit"
//           name="nom"
//           value={form.nom}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Code Barre */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Code barre
//         </label>

//         <div className="input-group">

//           <input
//             type="text"
//             className="form-control"
//             placeholder="Scanner ou générer"
//             name="codeBarre"
//             value={form.codeBarre}
//             onChange={handleChange}
//           />

//           <button
//             className="btn btn-success"
//             onClick={() => setScannerVisible(true)}
//             title="Scanner"
//           >
//             <FaCamera />
//           </button>

//           <button
//             className="btn btn-warning"
//             onClick={genererCodeBarre}
//             title="Générer"
//           >
//             <MdAutoFixHigh />
//           </button>

//         </div>
//       </div>

//       {/* Prix Achat */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Prix d'achat
//         </label>

//         <input
//           type="number"
//           className="form-control"
//           placeholder="0.00"
//           name="prixAchat"
//           value={form.prixAchat}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Prix Vente */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Prix de vente
//         </label>

//         <input
//           type="number"
//           className="form-control"
//           placeholder="0.00"
//           name="prixVente"
//           value={form.prixVente}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Stock */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Stock
//         </label>

//         <input
//           type="number"
//           className="form-control"
//           placeholder="Quantité"
//           name="stock"
//           value={form.stock}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Seuil */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Seuil d'alerte
//         </label>

//         <input
//           type="number"
//           className="form-control"
//           placeholder="Seuil"
//           name="seuilAlerte"
//           value={form.seuilAlerte}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Catégorie */}
//       <div className="col-lg-4 col-md-6 col-12">
//         <label className="form-label fw-bold">
//           Catégorie
//         </label>

//         <input
//           type="text"
//           className="form-control"
//           placeholder="Catégorie"
//           name="categorieNom"
//           value={form.categorieNom}
//           onChange={handleChange}
//         />
//       </div>

//     </div>

//     <div className="d-flex justify-content-end mt-4">

//       <button
//         className={`btn ${
//           editingId ? "btn-warning" : "btn-primary"
//         } px-5`}
//         onClick={enregistrerProduit}
//       >
//         {editingId ? "Modifier" : "Ajouter"}
//       </button>

//     </div>

//   </div>
// </div>
// {/* SCANNER */}
// {scannerVisible && (
//   <div className="card shadow-lg border-0 rounded-4 mb-4">
//     <div className="card-header bg-success text-white">
//       <h5 className="mb-0">
//         <FaCamera className="me-2" />
//         Scanner le code-barres
//       </h5>
//     </div>

//     <div className="card-body">

//       <BarcodeScanner onScan={rechercherParCodeBarre} />

//       <div className="text-end mt-3">
//         <button
//           className="btn btn-danger"
//           onClick={() => setScannerVisible(false)}
//         >
//           Fermer
//         </button>
//       </div>

//     </div>
//   </div>
// )}

//           {/* TABLE */}
//           <div className="card shadow-lg border-0 rounded-4 mt-4">

//   <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap">

//     <h5 className="mb-2 mb-md-0">
//       📦 Liste des Produits
//     </h5>

//     <span className="badge bg-primary fs-6">
//       {produits.length} Produits
//     </span>

//   </div>

//   <div className="table-responsive">

//     <table className="table table-hover align-middle mb-0">

//       <thead className="table-dark">

//         <tr>
//           <th>Produit</th>
//           <th>Prix</th>
//           <th>Stock</th>
//           <th>Etat</th>
//           <th className="text-center">Actions</th>
//         </tr>

//       </thead>

//       <tbody>

//         {produits.length === 0 ? (

//           <tr>

//             <td colSpan="5" className="text-center py-5">

//               <h5 className="text-muted">
//                 Aucun produit trouvé
//               </h5>

//             </td>

//           </tr>

//         ) : (

//           produits.map((p) => (

//             <tr key={p.id}>

//               <td>

//                 <div className="fw-bold">
//                   {p.nom}
//                 </div>

//                 <small className="text-muted">
//                   {p.codeBarre}
//                 </small>

//               </td>

//               <td>

//                 <span className="fw-bold text-success">
//                   {p.prixVente} DA
//                 </span>

//               </td>

//               <td>

//                 <span
//                   className={`badge ${
//                     p.stock === 0
//                       ? "bg-danger"
//                       : p.stock <= p.seuilAlerte
//                       ? "bg-warning text-dark"
//                       : "bg-success"
//                   }`}
//                 >
//                   {p.stock}
//                 </span>

//               </td>

//               <td>

//                 {p.stock === 0 ? (

//                   <span className="badge bg-danger px-3 py-2">
//                     <FaTimesCircle className="me-1" />
//                     Rupture
//                   </span>

//                 ) : p.stock <= p.seuilAlerte ? (

//                   <span className="badge bg-warning text-dark px-3 py-2">
//                     <FaExclamationTriangle className="me-1" />
//                     Stock faible
//                   </span>

//                 ) : (

//                   <span className="badge bg-success px-3 py-2">
//                     <FaCheckCircle className="me-1" />
//                     Disponible
//                   </span>

//                 )}

//               </td>

//               <td className="text-center">

//                 <button
//                   className="btn btn-warning btn-sm me-2"
//                   onClick={() => modifierProduit(p)}
//                   title="Modifier"
//                 >
//                   <FaEdit />
//                 </button>

//                 <button
//                   className="btn btn-danger btn-sm me-2"
//                   onClick={() => supprimerProduit(p.id)}
//                   title="Supprimer"
//                 >
//                   <FaTrash />
//                 </button>

//                 <button
//                   className="btn btn-success btn-sm"
//                   onClick={() => imprimerCodeBarre(p)}
//                   title="Imprimer"
//                 >
//                   <FaPrint />
//                 </button>

//               </td>

//             </tr>

//           ))

//         )}

//       </tbody>

//     </table>

//   </div>

// </div>
//         </div>
//        <div style={{ display: "none" }}>

//   {produitImpression && (
//     <BarcodePrint
//       ref={printRef}
//       produit={produitImpression}
//     />
//   )}

// </div>
//       </div>
//     </div>
//   );
// }

// export default Products;