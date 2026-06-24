import Side from "../components/Side";
import Navbar from "../components/Navbar";

function Sales() {
  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <h2>Ventes</h2>

          <button className="btn btn-success mb-3">
            Nouvelle Vente
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Client</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Client 1</td>
                <td>3500 DA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;