// src/components/ListUsersPage.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ListUsersPage({ onEditUser, onDeleteUser, shouldReloadUsers }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idInput, setIdInput] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch("http://localhost:8080/user/lista", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setUsers(data);
      } else {
        const txt = await resp.text().catch(() => "");
        setError(`Erro: ${txt || resp.statusText}`);
      }
    } catch (e) {
      setError(`Erro de conexão: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldReloadUsers) fetchUsers();
  }, [shouldReloadUsers]);

  const handleUpdateById = () => {
    if (idInput.toString().trim()) onEditUser(idInput);
    else setMessage("Digite o ID do usuário para atualizar.");
  };

  const handleDeleteById = () => {
    if (idInput.toString().trim()) onDeleteUser(idInput);
    else setMessage("Digite o ID do usuário para deletar.");
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={fetchUsers}>
          Recarregar
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Visualizar Usuários</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-3 p-3 shadow-sm">
        <h5 className="card-title">Gerenciar por ID</h5>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            placeholder="ID do usuário"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
          />
          <button className="btn btn-warning" onClick={handleUpdateById}>
            Atualizar
          </button>
          <button className="btn btn-danger" onClick={handleDeleteById}>
            Deletar
          </button>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id ?? u.email}>
              <td>{u.id}</td>
              <td>{u.name ?? u.nome ?? ""}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ListUsersPage.propTypes = {
  onEditUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  shouldReloadUsers: PropTypes.bool,
};

export default ListUsersPage;
