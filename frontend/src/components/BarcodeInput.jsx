import { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

function BarcodeInput({ codesBarres, setCodesBarres }) {
  const [showScanner, setShowScanner] = useState(false);
  const [code, setCode] = useState("");

  const ajouterCode = () => {
    const valeur = code.trim();

    if (!valeur) return;

    if (codesBarres.includes(valeur)) {
      alert("Ce code-barres existe déjà.");
      return;
    }

    setCodesBarres([...codesBarres, valeur]);
    setCode("");
  };

  const supprimerCode = (index) => {
    setCodesBarres(codesBarres.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="form-label fw-bold">Codes-barres</label>

      {codesBarres.length > 0 && (
        <ul className="list-group mb-3">
          {codesBarres.map((code, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {code}

              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => supprimerCode(index)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="input-group">

        <input
          type="text"
          className="form-control"
          placeholder="Entrer un code-barres"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ajouterCode();
            }
          }}
        />

        <button
          type="button"
          className="btn btn-success"
          onClick={() => setShowScanner(true)}
        >
          Scanner
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={ajouterCode}
        >
          Ajouter
        </button>

      </div>
      {showScanner && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Scanner un code-barres
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowScanner(false)}
                ></button>
              </div>

              <div className="modal-body">

                <BarcodeScanner
                  onScan={(barcode) => {

                    if (!codesBarres.includes(barcode)) {
                      setCodesBarres([
                        ...codesBarres,
                        barcode,
                      ]);
                    }

                    setShowScanner(false);
                  }}
                />

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarcodeInput;