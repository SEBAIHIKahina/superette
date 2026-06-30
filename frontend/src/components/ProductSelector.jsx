import { useEffect, useState } from "react";
import Select from "react-select";
import produitService from "../services/produit.service";

function ProductSelector({ value, onChange, refresh }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        loadProduits();
    }, [refresh]);

    const loadProduits = async () => {
        try {
            const res = await produitService.getActive();

            const produits = res.data.map((p) => ({
                value: p.id,
                label: `${p.nom} (Stock : ${p.stock})`,
                produit: p,
            }));

            setOptions(produits);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Select
            options={options}
            placeholder="Rechercher un produit..."
            isClearable
            value={options.find((o) => o.value === Number(value)) || null}
            onChange={(selected) =>
                onChange(selected ? selected.produit : null)
            }
        />
    );
}

export default ProductSelector;