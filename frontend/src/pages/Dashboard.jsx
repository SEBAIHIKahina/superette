import Side from "../components/Side";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="d-flex">
      <Side />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">
          <h2>Dashboard</h2>

          <div className="row">
            <div className="col-md-3">
              <div className="card p-3">
                <h5>Produits</h5>
                <h3>120</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3">
                <h5>Ventes</h5>
                <h3>40</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3">
                <h5>Achats</h5>
                <h3>15</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3">
                <h5>CA</h5>
                <h3>250000 DA</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;