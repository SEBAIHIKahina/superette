import { useEffect, useState } from "react";
import Side from "../components/Side";
import Navbar from "../components/Navbar";
import fournisseurService from "../services/fournisseur.service";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaUndo
} from "react-icons/fa";

function Fournisseurs() {

    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [editing, setEditing] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const [form, setForm] = useState({
        nom: "",
        telephone: "",
        email: "",
        adresse: "",
    });

    useEffect(() => {
        loadFournisseurs();
    }, []);

    const loadFournisseurs = async () => {
        try {
            const res = await fournisseurService.getAll();
            setFournisseurs(res.data.fournisseurs);
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des fournisseurs.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            nom: "",
            telephone: "",
            email: "",
            adresse: "",
        });

        setEditing(false);
        setSelectedId(null);
    };

    const openCreateModal = () => {
        resetForm();

        const modal = new Modal(
            document.getElementById("fournisseurModal")
        );

        modal.show();
    };

    const openEditModal = (fournisseur) => {

        setEditing(true);

        setSelectedId(fournisseur.id);

        setForm({
            nom: fournisseur.nom,
            telephone: fournisseur.telephone || "",
            email: fournisseur.email || "",
            adresse: fournisseur.adresse || "",
        });

        const modal = new Modal(
            document.getElementById("fournisseurModal")
        );

        modal.show();
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editing) {

                await fournisseurService.update(selectedId, form);

                alert("Fournisseur modifié avec succès.");

            } else {

                await fournisseurService.create(form);

                alert("Fournisseur ajouté avec succès.");

            }

            loadFournisseurs();

            const modal = Modal.getInstance(
                document.getElementById("fournisseurModal")
            );

            modal.hide();

            resetForm();

        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
        }
    };

    const fournisseursFiltres = fournisseurs.filter((f) =>
        f.nom.toLowerCase().includes(search.toLowerCase())
    );
    const handleDelete = async (id) => {

        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce fournisseur ?"
        );

        if (!confirmation) return;

        try {

            const res = await fournisseurService.remove(id);

            alert(res.data.message);

            loadFournisseurs();

        } catch (error) {

            console.error(error);

            alert("Erreur lors de la suppression.");

        }

    };

    const handleReactivate = async (id) => {

        try {

            const res = await fournisseurService.reactivate(id);

            alert(res.data.message);

            loadFournisseurs();

        } catch (error) {

            console.error(error);

            alert("Erreur lors de la réactivation.");

        }

    };
    return (
        <div className="d-flex">

            <Side />

            <div className="flex-grow-1">

                <Navbar />

                <div className="container-fluid mt-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h2>Gestion des fournisseurs</h2>

                        <button
                            className="btn btn-primary"
                            onClick={openCreateModal}
                        >
                            <FaPlus className="me-2" />
                            Nouveau fournisseur
                        </button>

                    </div>

                    <div className="card shadow">

                        <div className="card-body">

                            <div className="row mb-3">

                                <div className="col-md-4">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Rechercher..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                </div>

                            </div>

                            {loading ? (

                                <div className="text-center">

                                    Chargement...

                                </div>

                            ) : (

                                <table className="table table-bordered table-hover">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>Nom</th>
                                            <th>Téléphone</th>
                                            <th>Email</th>
                                            <th>Adresse</th>
                                            <th>Etat</th>
                                            <th width="220">Actions</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {fournisseursFiltres.map((fournisseur) => (

                                            <tr key={fournisseur.id}>

                                                <td>{fournisseur.nom}</td>

                                                <td>{fournisseur.telephone}</td>

                                                <td>{fournisseur.email}</td>

                                                <td>{fournisseur.adresse}</td>

                                                <td>

                                                    {fournisseur.etat ? (
                                                        <span className="badge bg-success">
                                                            Actif
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-danger">
                                                            Désactivé
                                                        </span>
                                                    )}

                                                </td>

                                                <td>

                                                    <>
                                                        <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => openEditModal(fournisseur)}
                                                        >

                                                            <FaEdit />

                                                        </button>

                                                        {fournisseur.etat ? (

                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleDelete(fournisseur.id)}
                                                            >

                                                                <FaTrash />

                                                            </button>

                                                        ) : (

                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleReactivate(fournisseur.id)}
                                                            >

                                                                <FaUndo />

                                                            </button>

                                                        )}
                                                    </>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </div>

                    <div
                        className="modal fade"
                        id="fournisseurModal"
                        tabIndex="-1"
                    >

                        <div className="modal-dialog">

                            <div className="modal-content">

                                <form onSubmit={handleSubmit}>

                                    <div className="modal-header">

                                        <h5 className="modal-title">

                                            {editing
                                                ? "Modifier un fournisseur"
                                                : "Ajouter un fournisseur"}

                                        </h5>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                        ></button>

                                    </div>

                                    <div className="modal-body">

                                        <div className="mb-3">

                                            <label className="form-label">

                                                Nom *

                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nom"
                                                value={form.nom}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">

                                                Téléphone

                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="telephone"
                                                value={form.telephone}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">

                                                Email

                                            </label>

                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">

                                                Adresse

                                            </label>

                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                name="adresse"
                                                value={form.adresse}
                                                onChange={handleChange}
                                            />

                                        </div>

                                    </div>

                                    <div className="modal-footer">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Annuler
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            {editing
                                                ? "Modifier"
                                                : "Ajouter"}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Fournisseurs;