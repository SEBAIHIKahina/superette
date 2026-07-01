function SaleTable({ panier, setPanier }) {

    const modifierQuantite = (index, quantite) => {

        if (quantite < 1) return;

        const nouveau = [...panier];

        nouveau[index].quantite = Number(quantite);

        setPanier(nouveau);

    };

    const supprimer = (index) => {

        setPanier(
            panier.filter((_, i) => i !== index)
        );

    };

    const total = panier.reduce(
        (s, p) => s + p.quantite * p.prixVente,
        0
    );

    return (

        <div className="card">

            <div className="card-header">
                Panier
            </div>

            <div className="card-body p-0">

                <table className="table table-bordered table-hover mb-0">

                    <thead className="table-dark">

                        <tr>
                            <th>Produit</th>
                            <th width="120">Prix</th>
                            <th width="120">Qté</th>
                            <th width="150">Sous-total</th>
                            <th width="80">Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {panier.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center"
                                >
                                    Aucun produit.
                                </td>

                            </tr>

                        ) : (

                            panier.map((p, index) => (

                                <tr key={index}>

                                    <td>{p.nom}</td>

                                    <td>{p.prixVente} DA</td>

                                    <td>

                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            value={p.quantite}
                                            onChange={(e) =>
                                                modifierQuantite(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </td>

                                    <td>

                                        {(
                                            p.quantite *
                                            p.prixVente
                                        ).toFixed(2)}{" "}
                                        DA

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                supprimer(index)
                                            }
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                    <tfoot>

                        <tr>

                            <th
                                colSpan="3"
                                className="text-end"
                            >
                                Total
                            </th>

                            <th>{total.toFixed(2)} DA</th>

                            <th></th>

                        </tr>

                    </tfoot>

                </table>

            </div>

        </div>

    );

}

export default SaleTable;