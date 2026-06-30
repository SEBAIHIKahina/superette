import { useEffect, useState } from "react";

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
0

  const filteredProduits = produits.filter((p) => {

    const recherche = search.toLowerCase();

    const codeTrouve = p.code_barres?.some((c) =>
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
      

      <div className="flex-grow-1">
       

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

