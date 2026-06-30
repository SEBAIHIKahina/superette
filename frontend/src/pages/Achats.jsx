import { useEffect, useState } from "react";

import achatService from "../services/achat.service";
import fournisseurService from "../services/fournisseur.service";
import produitService from "../services/produit.service";

import ProductSelector from "../components/ProductSelector";
import AchatTable from "../components/AchatTable";
import ProductModal from "../components/ProductModal";
import categorieService from "../services/categorie.service";
import BarcodeScanner from "../components/BarcodeScanner";
import Side from "../components/Side";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Achats() {
    const navigate = useNavigate();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [lignes, setLignes] = useState([]);
    const [refreshProducts, setRefreshProducts] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [achats, setAchats] = useState([]);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [showForm, setShowForm] = useState(false);

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
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadFournisseurs();
        loadCategories();
        loadAchats();
    }, []);
    const loadCategories = async () => {
        try {
            const res = await categorieService.getActive();
            setCategories(res.data || []);
        } catch (err) {
            console.error(err);
            setCategories([]);
        }
    };
    const loadFournisseurs = async () => {

        try {

            const res = await fournisseurService.getActive();

            setFournisseurs(res.data);

        } catch (err) {

            console.error(err);

        }

    };
    const handleScan = async (code) => {
        try {
            const res = await produitService.getByBarcode(code);
            const produit = res.data;

            setLigne((prev) => ({
                ...prev,
                produitId: produit.id,
                nomProduit: produit.nom,
            }));

        } catch (err) {
            alert("Produit introuvable");
        }
    };
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
    const handleSaveProduct = async (data) => {
        try {
            await produitService.create(data);

            setShowProductModal(false);

            setRefreshProducts((prev) => !prev);

        } catch (err) {
            console.error(err);
            alert("Erreur création produit");
        }
    };
    const loadAchats = async () => {
        try {
            const res = await achatService.getAll();
            setAchats(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };
    const filteredAchats = achats.filter((a) => {

        const r = search.toLowerCase();

        const matchText =
            a.remarque?.toLowerCase().includes(r) ||
            a.fournisseur?.nom?.toLowerCase().includes(r) ||
            String(a.id).includes(r);

        const matchDate = dateFilter
            ? new Date(a.createdAt).toISOString().split("T")[0] === dateFilter
            : true;

        return matchText && matchDate;
    });
    const handleProduitChange = (produit) => {

        if (!produit) {
            setLigne({
                ...ligne,
                produitId: "",
                nomProduit: "",
            });
            return;
        }

        setLigne({
            ...ligne,
            produitId: produit.id,
            nomProduit: produit.nom,
        });

    };



    const ajouterLigne = () => {

        if (
            !ligne.produitId ||
            !ligne.prixAchat ||
            !ligne.quantite
        ) {
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

        setLignes(
            lignes.filter((_, i) => i !== index)
        );

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

            alert("Achat enregistré avec succès.");

            setAchat({
                fournisseurId: "",
                remarque: "",
            });

            setLignes([]);

        } catch (err) {

            console.error(err);

            alert("Erreur lors de l'enregistrement.");

        }

    };

    const onProductCreated = () => {

        setShowProductModal(false);

        setRefreshProducts(!refreshProducts);

    };

    return (

        <div className="d-flex">

            <Side />

            <div className="flex-grow-1">

                <Navbar />

                <div className="container-fluid py-4">

                    <h2 className="mb-4">Gestion des achats</h2>
                    <div className="d-flex justify-content-between mb-3">

                        <div className="d-flex w-75">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher achat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <input
                                type="date"
                                className="form-control ms-2"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />

                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/achats/nouveau")}
                        >
                            + Nouvelle achat
                        </button>

                    </div>
                    <table className="table table-bordered">

                        <thead className="table-dark">
                            <tr>
                                <th>N° Achat</th>
                                <th>Date d'achat</th>
                                <th>Fournisseur</th>
                                <th>Remarque</th>
                                <th>Total</th>
                                <th width="120">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredAchats.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Aucun achat
                                    </td>
                                </tr>
                            ) : (
                                filteredAchats.map((a) => (

                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>
                                            {new Date(a.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>{a.fournisseur?.nom}</td>
                                        <td>{a.remarque}</td>
                                        <td>{a.montantTotal} DA</td>

                                        <td>
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => navigate(`/achats/${a.id}`)}
                                            >
                                                Consulter
                                            </button>

                                        </td>
                                    </tr>

                                ))
                            )}

                        </tbody>

                    </table>



                </div>

            </div>

        </div>
    );

}

export default Achats;