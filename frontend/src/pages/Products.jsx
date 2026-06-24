import Side from "../components/Side";
import Navbar from "../components/Navbar";

function Products() {
  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <h2>Produits</h2>

          <button className="btn btn-primary mb-3">
            Ajouter Produit
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Lait</td>
                <td>120 DA</td>
                <td>50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;