function Navbar({ toggleSidebar }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-3">

      <button
        className="btn btn-outline-success me-3"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      <div className="d-flex align-items-center">
       

        <div>
          <h4 className="mb-0 fw-bold">Gestion de Magasin</h4>
          <small className="text-muted">
            Système de gestion des ventes
          </small>
        </div>
      </div>

      <div className="ms-auto d-flex align-items-center gap-4">

        <button className="btn btn-light position-relative">
          <i className="bi bi-bell fs-5"></i>

          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>

        <div className="d-flex align-items-center">
          <i className="bi bi-person-circle fs-2 text-secondary me-2"></i>

          <div>
            <div className="fw-semibold">Administrateur</div>
            <small className="text-muted">En ligne</small>
          </div>
        </div>

      </div>

    </nav>
  );
}

export default Navbar;