import { useEffect, useState } from "react";
import produitService from "../services/produit.service";

function ProductSelector({ value, onChange }) {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = async () => {
    try {
      const res = await produitService.getActive();

      setProduits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Sélectionner un produit</option>

      {produits.map((produit) => (
        <option key={produit.id} value={produit.id}>
          {produit.nom}
        </option>
      ))}
    </select>
  );
}

export default ProductSelector;