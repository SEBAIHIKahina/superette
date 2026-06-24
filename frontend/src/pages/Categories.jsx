import Side from "../components/Side";
import Navbar from "../components/Navbar";

function Categories() {
  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <h2>Catégories</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Boissons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;