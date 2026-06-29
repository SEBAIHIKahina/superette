import { Link } from "react-router-dom";

function Side() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h3>Magasin</h3>

      <ul className="nav flex-column mt-4">
        <li>
          <Link className="nav-link text-white" to="/">
            Dashboard
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/products">
            Produits
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/categories">
            Catégories
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/sales">
            Ventes
          </Link>
        </li>
        <li>
          <Link className="nav-link text-white" to="/Fournisseurs">
            Fournisseurs
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Side;