import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import achatService from "../services/achat.service";



function DetailAchat() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [achat, setAchat] = useState(null);

    useEffect(() => {
        loadAchat();
    }, []);

    const loadAchat = async () => {
        try {
            const res = await achatService.getOne(id);
            setAchat(res.data);
        } catch (err) {
            console.error(err);
            alert("Erreur lors du chargement de l'achat.");
        }
    };

    if (!achat) {
        return (
            <div className="text-center mt-5">
                Chargement...
            </div>
        );
    }

    return (
        <div className="d-flex">

            

            <div className="flex-grow-1">

                

                <div className="container-fluid py-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h2>
                            Détail de l'achat N° {achat.id}
                        </h2>

                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/achats")}
                        >
                            Retour
                        </button>

                    </div>

                    <div className="card shadow-sm mb-4">

                        <div className="card-header">
                            Informations générales
                        </div>

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-3 mb-3">

                                    <strong>N° Achat</strong>

                                    <div>{achat.id}</div>

                                </div>

                                <div className="col-md-3 mb-3">

                                    <strong>Date</strong>

                                    <div>
                                        {new Date(achat.createdAt).toLocaleString()}
                                    </div>

                                </div>

                                <div className="col-md-3 mb-3">

                                    <strong>Fournisseur</strong>

                                    <div>
                                        {achat.fournisseur?.nom}
                                    </div>

                                </div>

                                <div className="col-md-3 mb-3">

                                    <strong>Montant Total</strong>

                                    <div>
                                        {achat.montantTotal} DA
                                    </div>

                                </div>

                            </div>

                            <div className="row">

                                <div className="col-md-12">

                                    <strong>Remarque</strong>

                                    <div>
                                        {achat.remarque || "-"}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm">

                        <div className="card-header">
                            Produits achetés
                        </div>

                        <div className="card-body">

                            <table className="table table-bordered table-hover">

                                <thead className="table-light">

                                    <tr>

                                        <th>Produit</th>

                                        <th>Prix Achat</th>

                                        <th>Quantité initiale</th>

                                        <th>Quantité restante</th>

                                        <th>Date expiration</th>

                                        <th>Total</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {achat.lots?.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="text-center"
                                            >
                                                Aucun produit.
                                            </td>

                                        </tr>

                                    )}

                                    {achat.lots?.map((lot) => (

                                        <tr key={lot.id}>

                                            <td>
                                                {lot.produit?.nom}
                                            </td>

                                            <td>
                                                {lot.prixAchat} DA
                                            </td>

                                            <td>
                                                {lot.quantiteInitiale}
                                            </td>

                                            <td>
                                                {lot.quantiteRestante}
                                            </td>

                                            <td>
                                                {lot.dateExpiration
                                                    ? new Date(
                                                          lot.dateExpiration
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td>
                                                {lot.prixAchat *
                                                    lot.quantiteInitiale}{" "}
                                                DA
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DetailAchat;