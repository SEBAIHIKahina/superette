import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import achatService from "../services/achat.service";
import fournisseurService from "../services/fournisseur.service";
import categorieService from "../services/categorie.service";

import ProductSelector from "../components/ProductSelector";
import AchatTable from "../components/AchatTable";
import ProductModal from "../components/ProductModal";
import BarcodeScanner from "../components/BarcodeScanner";
import Side from "../components/Side";
import Navbar from "../components/Navbar";
import produitService from "../services/produit.service";

function NewAchat() {

    const navigate = useNavigate();

    // ================= STATE =================
    const [fournisseurs, setFournisseurs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [lignes, setLignes] = useState([]);

    const [showProductModal, setShowProductModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const [refreshProducts, setRefreshProducts] = useState(false);

    const [achat, setAchat] = useState({
        fournisseurId: "",
        remarque: "",
    });

    const [ligne, setLigne] = useState({
        produitId: "",
        nomProduit: "",
        prixAchat: "",
        quantite: 1,
        dateExpiration: "",
    });

    // ================= LOAD DATA =================
    useEffect(() => {
        loadFournisseurs();
        loadCategories();
    }, []);

    const loadFournisseurs = async () => {
        try {
            const res = await fournisseurService.getActive();
            setFournisseurs(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await categorieService.getActive();
            setCategories(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ================= HANDLES =================
    const handleAchatChange = (e) => {
        setAchat({
            ...achat,
            [e.target.name]: e.target.value,
        });
    };

    const handleLigneChange = (e) => {
        setLigne({
            ...ligne,
            [e.target.name]: e.target.value,
        });
    };

    const handleProduitChange = (produit) => {
        if (!produit) {
            setLigne({ ...ligne, produitId: "", nomProduit: "" });
            return;
        }

        setLigne({
            ...ligne,
            produitId: produit.id,
            nomProduit: produit.nom,
        });
    };

    const ajouterLigne = () => {
        if (!ligne.produitId || !ligne.prixAchat || !ligne.quantite) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        setLignes([
            ...lignes,
            {
                ...ligne,
                produitId: Number(ligne.produitId),
                prixAchat: Number(ligne.prixAchat),
                quantite: Number(ligne.quantite),
            },
        ]);

        setLigne({
            produitId: "",
            nomProduit: "",
            prixAchat: "",
            quantite: 1,
            dateExpiration: "",
        });
    };

    const supprimerLigne = (index) => {
        setLignes(lignes.filter((_, i) => i !== index));
    };

    const enregistrerAchat = async () => {
        if (!achat.fournisseurId) {
            alert("Sélectionnez un fournisseur.");
            return;
        }

        if (lignes.length === 0) {
            alert("Ajoutez au moins un produit.");
            return;
        }

        try {
            await achatService.create({
                fournisseurId: achat.fournisseurId,
                remarque: achat.remarque,
                lots: lignes.map((l) => ({
                    produitId: l.produitId,
                    quantite: l.quantite,
                    prixAchat: l.prixAchat,
                    dateExpiration: l.dateExpiration || null,
                })),
            });

            alert("Achat enregistré avec succès !");
            navigate("/achats");

        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement.");
        }
    };
    const handleProductCreated = async (data) => {
        try {
            await produitService.create(data);

            setShowProductModal(false);
            setRefreshProducts(prev => !prev);

        } catch (err) {
            alert("Erreur création produit");
            console.error(err);
        }
    };
    const handleScan = async (code) => {
        try {
            const res = await produitService.getByBarcode(code);

            if (res.data) {
                setLigne({
                    ...ligne,
                    produitId: res.data.id,
                    nomProduit: res.data.nom,
                });
            }

            setShowScanner(false);

        } catch (err) {
            alert("Produit introuvable");
            setShowScanner(false);
        }
    };

    // ================= RENDER =================
    return (
        <div className="d-flex">

            <Side />

            <div className="flex-grow-1">

                <Navbar />

                <div className="container-fluid py-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h2 className="mb-0">Nouvel achat</h2>

                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/achats")}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Retour
                        </button>

                    </div>

                    {/* ================= ACHAT INFO ================= */}

                    <div className="card mb-4">
                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label>Fournisseur</label>

                                    <select
                                        className="form-select"
                                        name="fournisseurId"
                                        value={achat.fournisseurId}
                                        onChange={handleAchatChange}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {fournisseurs.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Remarque</label>
                                    <input
                                        className="form-control"
                                        name="remarque"
                                        value={achat.remarque}
                                        onChange={handleAchatChange}
                                    />
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* ================= PRODUIT ================= */}
                    <div className="card mb-4">
                        <div className="card-body">

                            <div className="row align-items-end">

                                <div className="col-md-4">

                                    <label>Produit</label>

                                    <div className="d-flex">

                                        <div className="flex-grow-1">
                                            <ProductSelector
                                                value={ligne.produitId}
                                                onChange={handleProduitChange}
                                                refresh={refreshProducts}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-success ms-2"
                                            onClick={() => setShowScanner(true)}
                                        >
                                            Scan
                                        </button>

                                        <button
                                            className="btn btn-success ms-2"
                                            onClick={() => setShowProductModal(true)}
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                                <div className="col-md-2">
                                    <label>Prix</label>
                                    <input
                                        className="form-control"
                                        name="prixAchat"
                                        value={ligne.prixAchat}
                                        onChange={handleLigneChange}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label>Quantité</label>
                                    <input
                                        className="form-control"
                                        name="quantite"
                                        value={ligne.quantite}
                                        onChange={handleLigneChange}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label>Expiration</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateExpiration"
                                        value={ligne.dateExpiration}
                                        onChange={handleLigneChange}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={ajouterLigne}
                                    >
                                        Ajouter
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* ================= TABLE ================= */}
                    <AchatTable
                        lignes={lignes}
                        onRemove={supprimerLigne}
                    />

                    {/* ================= SAVE ================= */}
                    <div className="text-end mt-4">
                        <button
                            className="btn btn-success btn-lg"
                            onClick={enregistrerAchat}
                        >
                            Enregistrer achat
                        </button>
                    </div>

                    {/* ================= MODAL PRODUIT ================= */}
                    {showProductModal && (
                        <ProductModal
                            show={showProductModal}
                            onClose={() => setShowProductModal(false)}
                            onSave={handleProductCreated}
                            categories={categories}
                        />
                    )}

                    {/* ================= SCANNER ================= */}
                    {showScanner && (
                        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5>Scanner</h5>
                                        <button className="btn-close" onClick={() => setShowScanner(false)} />
                                    </div>

                                    <div className="modal-body">
                                        <BarcodeScanner onScan={handleScan} />
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </div>

    );
}

export default NewAchat;