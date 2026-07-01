import { useEffect, useState } from "react";

function PaymentModal({
    show,
    total,
    onClose,
    onConfirm,
}) {

    const [montant, setMontant] = useState("");

    useEffect(() => {

        if (show)
            setMontant("");

    }, [show]);

    if (!show) return null;

    const monnaie =
        montant === ""
            ? 0
            : Number(montant) - total;

    return (

        <div
            className="modal d-block"
            style={{
                background: "rgba(0,0,0,.5)",
            }}
        >

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5>Paiement</h5>

                    </div>

                    <div className="modal-body">

                        <h4 className="mb-4">

                            Total :

                            <span className="float-end">

                                {total.toFixed(2)} DA

                            </span>

                        </h4>

                        <label>

                            Montant payé

                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={montant}
                            onChange={(e) =>
                                setMontant(e.target.value)
                            }
                        />

                        <h4 className="mt-4">

                            Monnaie :

                            <span className="float-end">

                                {monnaie > 0
                                    ? monnaie.toFixed(2)
                                    : "0.00"}{" "}
                                DA

                            </span>

                        </h4>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </button>

                        <button
                            className="btn btn-success"
                            disabled={
                                Number(montant) < total
                            }
                            onClick={() =>
                                onConfirm(
                                    Number(montant)
                                )
                            }
                        >
                            Confirmer
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default PaymentModal;