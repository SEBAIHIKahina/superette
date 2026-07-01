// 



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import venteService from "../services/vente.service";



function Sales() {

  const navigate = useNavigate();

  const [ventes, setVentes] = useState([]);

  const [search, setSearch] = useState("");

  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    loadVentes();
  }, []);

  const loadVentes = async () => {

    try {

      const res = await venteService.getAll();

      setVentes(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  const filteredVentes = ventes.filter((v) => {

    const txt = search.toLowerCase();

    const okTexte =
      String(v.id).includes(txt);

    const okDate = dateFilter
      ? new Date(v.dateVente)
        .toISOString()
        .split("T")[0] === dateFilter
      : true;

    return okTexte && okDate;

  });

  return (

    <div className="d-flex">

      

      <div className="flex-grow-1">

        

        <div className="container-fluid py-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="mb-0">
              Gestion des ventes
            </h2>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/sales/new")}
            >
              + Nouvelle vente
            </button>

          </div>

          <div className="row mb-3">

            <div className="col-md-8">

              <input
                className="form-control"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value)
                }
              />

            </div>

          </div>

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>

                <th>N°</th>

                <th>Date</th>

                <th>Total</th>

                <th width="120">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredVentes.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center"
                  >
                    Aucune vente.
                  </td>

                </tr>

              ) : (

                filteredVentes.map((v) => (

                  <tr key={v.id}>

                    <td>{v.id}</td>

                    <td>

                      {new Date(
                        v.dateVente
                      ).toLocaleString()}

                    </td>

                    <td>

                      {v.total.toFixed(2)} DA

                    </td>

                    <td>

                      <button
                        className="btn btn-info btn-sm"
                        onClick={() =>
                          navigate(
                            `/sales/${v.id}`
                          )
                        }
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Sales;