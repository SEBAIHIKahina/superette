import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import produitService from "../services/produit.service";
import venteService from "../services/vente.service";

import ProductSelector from "../components/ProductSelector";
import BarcodeScanner from "../components/BarcodeScanner";
import SaleTable from "../components/SaleTable";
import TicketPrint from "../components/TicketPrint";



function NewSale() {

    const navigate = useNavigate();

    const [scannerVisible, setScannerVisible] = useState(false);

    const [panier, setPanier] = useState([]);

    const [ligne, setLigne] = useState({
        produitId: "",
        nom: "",
        prixVente: 0,
        quantite: 1,
    });

    const ticketRef = useRef();

    const [venteImpression, setVenteImpression] = useState(null);

    const [montantPaye, setMontantPaye] = useState("");

    const total = panier.reduce(
        (s, p) => s + p.quantite * p.prixVente,
        0
    );
    const handlePrint = useReactToPrint({
        contentRef: ticketRef,
    });
    const monnaie =
        montantPaye === ""
            ? 0
            : Number(montantPaye) - total;

    const handleProduitChange = (produit) => {

        if (!produit) {

            setLigne({
                produitId: "",
                nom: "",
                prixVente: 0,
                quantite: 1,
            });

            return;
        }

        setLigne({
            produitId: produit.id,
            nom: produit.nom,
            prixVente: produit.prixVente,
            quantite: 1,
        });

    };

    const handleScan = async (code) => {

        try {

            const res = await produitService.getByBarcode(code);

            handleProduitChange(res.data);

            setScannerVisible(false);

        } catch {

            alert("Produit introuvable.");

        }

    };

    const ajouterProduit = () => {

        if (!ligne.produitId) {

            alert("Choisissez un produit.");

            return;

        }

        const existe = panier.find(
            p => p.produitId === ligne.produitId
        );

        if (existe) {

            setPanier(
                panier.map(p =>
                    p.produitId === ligne.produitId
                        ? {
                            ...p,
                            quantite: p.quantite + ligne.quantite,
                        }
                        : p
                )
            );

        } else {

            setPanier([
                ...panier,
                {
                    ...ligne,
                },
            ]);

        }

        setLigne({
            produitId: "",
            nom: "",
            prixVente: 0,
            quantite: 1,
        });

    };
   const validerVente = async () => {

    if (panier.length === 0) {
        alert("Le panier est vide.");
        return;
    }

    if (Number(montantPaye) < total) {
        alert("Le montant payé est insuffisant.");
        return;
    }

    try {

        const res = await venteService.create({

            total,

            lignes: panier.map((p) => ({
                produitId: p.produitId,
                quantite: p.quantite,
                prixVente: p.prixVente,
            })),

        });

        const venteComplete = await venteService.getOne(
            res.data.venteId
        );

        setVenteImpression(venteComplete.data);

        setTimeout(() => {

            handlePrint();

            setPanier([]);

            setMontantPaye("");

            setLigne({
                produitId: "",
                nom: "",
                prixVente: 0,
                quantite: 1,
            });

        }, 300);

    } catch (err) {

        console.error(err);

        alert(
            err.response?.data?.message ||
            "Erreur lors de la vente."
        );

    }

};

    return (

        <div className="d-flex">



            <div className="flex-grow-1">



                <div className="container-fluid py-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h2 className="mb-0">
                            Nouvelle vente
                        </h2>

                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/sales")}
                        >
                            Retour
                        </button>

                    </div>

                    <div className="card mb-4">

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-7">

                                    <label className="form-label">
                                        Produit
                                    </label>

                                    <ProductSelector
                                        value={ligne.produitId}
                                        onChange={handleProduitChange}
                                    />

                                </div>

                                <div className="col-md-2">

                                    <label className="form-label">
                                        Quantité
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        value={ligne.quantite}
                                        onChange={(e) =>
                                            setLigne({
                                                ...ligne,
                                                quantite: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />

                                </div>

                                <div className="col-md-3 d-flex align-items-end">

                                    <button
                                        className="btn btn-success me-2"
                                        onClick={ajouterProduit}
                                    >
                                        Ajouter
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            setScannerVisible(true)
                                        }
                                    >
                                        Scanner
                                    </button>

                                </div>

                            </div>

                            {scannerVisible && (

                                <div className="mt-3">

                                    <BarcodeScanner
                                        onScan={handleScan}
                                    />

                                </div>

                            )}

                        </div>

                    </div>

                    <SaleTable
                        panier={panier}
                        setPanier={setPanier}
                    />

                    <div className="card mt-4">

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-4">

                                    <h4>
                                        Total : {total} DA
                                    </h4>

                                </div>

                                <div className="col-md-4">

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Montant payé"
                                        value={montantPaye}
                                        onChange={(e) =>
                                            setMontantPaye(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="col-md-4">

                                    <h4>

                                        Monnaie :{" "}

                                        {monnaie > 0
                                            ? monnaie
                                            : 0}{" "}
                                        DA

                                    </h4>

                                </div>

                            </div>

                        </div>

                    </div>
                    <div className="text-end mt-4">

                        <button
                            className="btn btn-success btn-lg"
                            onClick={validerVente}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Valider la vente
                        </button>

                    </div>
                </div>

            </div>


        </div>

    );

}

export default NewSale;