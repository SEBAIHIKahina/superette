import { forwardRef } from "react";

const TicketPrint = forwardRef(({ vente, montantPaye }, ref) => {

    const monnaie = montantPaye - vente.total;

    return (

        <div
            ref={ref}
            style={{
                width: "300px",
                padding: "15px",
                background: "white",
                fontFamily: "monospace",
                fontSize: "14px",
            }}
        >

            <div style={{ textAlign: "center" }}>

                <h3>SUPERETTE</h3>

                <p>Merci pour votre visite</p>

            </div>

            <hr />

            <p>

                Vente N° : {vente.id}

                <br />

                {new Date(vente.dateVente).toLocaleString()}

            </p>

            <hr />

            {vente.detailventes.map((d) => (

                <div
                    key={d.id}
                    style={{
                        marginBottom: "8px",
                    }}
                >

                    <strong>

                        {d.produit.nom}

                    </strong>

                    <br />

                    {d.quantite} × {d.prixUnitaire} DA

                    <span style={{ float: "right" }}>

                        {(d.quantite * d.prixUnitaire).toFixed(2)} DA

                    </span>

                </div>

            ))}

            <hr />

            <h4>

                Total :

                <span style={{ float: "right" }}>

                    {vente.total.toFixed(2)} DA

                </span>

            </h4>

            <p>

                Payé :

                <span style={{ float: "right" }}>

                    {montantPaye.toFixed(2)} DA

                </span>

            </p>

            <p>

                Monnaie :

                <span style={{ float: "right" }}>

                    {monnaie.toFixed(2)} DA

                </span>

            </p>

            <hr />

            <div style={{ textAlign: "center" }}>

                Merci 😊

            </div>

        </div>

    );

});

export default TicketPrint;