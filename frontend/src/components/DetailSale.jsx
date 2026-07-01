import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import venteService from "../services/vente.service";


import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import TicketPrint from "../components/TicketPrint";

function DetailSale() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [vente, setVente] = useState(null);

    useEffect(() => {
        loadVente();
    }, []);

    const loadVente = async () => {

        try {

            const res = await venteService.getOne(id);

            setVente(res.data);

        } catch (err) {

            console.error(err);

            alert("Impossible de charger la vente.");

        }

    };

    const ticketRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: ticketRef,
    });
    if (!vente)
        return <div className="p-4">Chargement...</div>;

    return (

        <div className="d-flex">

           

            <div className="flex-grow-1">

                

                <div className="container-fluid py-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h2>Détail de la vente #{vente.id}</h2>

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

                                <div className="col-md-6">

                                    <strong>Date :</strong>

                                    <br />

                                    {new Date(
                                        vente.dateVente
                                    ).toLocaleString()}

                                </div>

                                <div className="col-md-6">

                                    <strong>Total :</strong>

                                    <br />

                                    {vente.total} DA

                                </div>

                            </div>

                        </div>

                    </div>

                    <table className="table table-bordered">

                        <thead className="table-dark">

                            <tr>

                                <th>Produit</th>

                                <th>Prix</th>

                                <th>Quantité</th>

                                <th>Sous-total</th>

                            </tr>

                        </thead>

                        <tbody>

                            {vente.detailventes?.map((d) => (

                                <tr key={d.id}>

                                    <td>
                                        {d.produit?.nom}
                                    </td>

                                    <td>
                                        {d.prixUnitaire} DA
                                    </td>

                                    <td>
                                        {d.quantite}
                                    </td>

                                    <td>
                                        {(
                                            d.quantite *
                                            d.prixUnitaire
                                        ).toFixed(2)}{" "}
                                        DA
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <div className="text-end">

                        <h4>

                            Total : {vente.total} DA

                        </h4>

                    </div>

                    <div className="mt-4">

                        <button
                            className="btn btn-success me-2"
                            onClick={handlePrint}
                        >
                            <i className="bi bi-printer me-2"></i>

                            Imprimer le ticket

                        </button>

                    </div>
                    <div style={{ display: "none" }}>

                        <TicketPrint
                            ref={ticketRef}
                            vente={vente}
                            montantPaye={vente.total}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DetailSale;