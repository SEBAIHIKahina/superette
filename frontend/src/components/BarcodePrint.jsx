import Barcode from "react-barcode";
import { forwardRef } from "react";

const BarcodePrint = forwardRef(({ produit }, ref) => (
  <div
    ref={ref}
    style={{
      width: "300px",
      padding: "20px",
      textAlign: "center",
      background: "white",
    }}
  >
    <h4>{produit.nom}</h4>

    <Barcode
      value={produit.codeBarre}
      width={2}
      height={80}
      fontSize={18}
    />

    <p>{produit.prixVente} DA</p>
  </div>
));

export default BarcodePrint;