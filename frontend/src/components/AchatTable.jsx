import produitService from "../services/produit.service";

function AchatTable({ lignes, onRemove }) {

    const total = lignes.reduce(
        (s, l) => s + l.prixAchat * l.quantite,
        0
    );

    return (
        <div className="card shadow-sm mt-4">

            <div className="card-header">
                <h5 className="mb-0">Produits de l'achat</h5>
            </div>

            <div className="card-body">

                <table className="table table-bordered table-hover">

                    <thead>

                        <tr>

                            <th>Produit</th>

                            <th>Prix achat</th>

                            <th>Quantité</th>

                            <th>Expiration</th>

                            <th>Total</th>

                            <th width="80">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {lignes.length === 0 && (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center"
                                >
                                    Aucun produit ajouté.
                                </td>

                            </tr>

                        )}

                        {lignes.map((l, index) => (

                            <tr key={index}>

                                <td>{l.nomProduit}</td>

                                <td>{l.prixAchat} DA</td>

                                <td>{l.quantite}</td>

                                <td>
                                    {l.dateExpiration || "-"}
                                </td>

                                <td>
                                    {l.prixAchat * l.quantite} DA
                                </td>

                                <td>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onRemove(index)}
                                    >
                                        X
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <h4 className="text-end">

                    Total : {total} DA

                </h4>

            </div>

        </div>
    );
}

export default AchatTable;