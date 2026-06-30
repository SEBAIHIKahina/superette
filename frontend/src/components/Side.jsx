import { NavLink,Link } from "react-router-dom";

function Side({ collapsed }) {
  return (
    <div
      className="bg-dark text-white d-flex flex-column p-3 shadow"
      style={{
        width: collapsed ? "70px" : "260px",
        minHeight: "100vh",
        transition: "all .3s ease",
      }}
    >
      {/* Logo */}
      <div className="text-center mb-4">

        <i className="bi bi-shop fs-1 text-success"></i>

        {!collapsed && (
          <>
            <h4 className="fw-bold mt-2 mb-0">Superette</h4>
            <small className="text-secondary">
              Gestion de Magasin
            </small>
          </>
        )}

      </div>

      <hr className="border-secondary" />

      <ul className="nav nav-pills flex-column">

        <li className="nav-item mb-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive
                  ? "bg-success text-white"
                  : "text-white"
              }`
            }
          >
            <i className="bi bi-speedometer2"></i>

            {!collapsed && (
              <span className="ms-2">Dashboard</span>
            )}
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive
                  ? "bg-success text-white"
                  : "text-white"
              }`
            }
          >
            <i className="bi bi-box-seam"></i>

            {!collapsed && (
              <span className="ms-2">Produits</span>
            )}
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive
                  ? "bg-success text-white"
                  : "text-white"
              }`
            }
          >
            <i className="bi bi-tags"></i>

            {!collapsed && (
              <span className="ms-2">Catégories</span>
            )}
          </NavLink>
        </li>
        <li>
          <Link className="nav-link text-white" to="/achats">
            Achats
          </Link>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/sales"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive
                  ? "bg-success text-white"
                  : "text-white"
              }`
            }
          >
            <i className="bi bi-cart-check"></i>

            {!collapsed && (
              <span className="ms-2">Ventes</span>
            )}
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/fournisseurs"
            className={({ isActive }) =>
              `nav-link rounded ${
                isActive
                  ? "bg-success text-white"
                  : "text-white"
              }`
            }
          >
            <i className="bi bi-truck"></i>

            {!collapsed && (
              <span className="ms-2">Fournisseurs</span>
            )}
          </NavLink>
        </li>

      </ul>

    

    </div>
  );
}

export default Side;