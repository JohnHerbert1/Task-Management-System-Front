import { useState } from "react";
import PropTypes from "prop-types";

function DeleteUserPage({ idUser, onUserDeleted, onCancel }) {
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    try {
      const resp = await fetch(`http://localhost:8080/user/${idUser}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || "Erro ao deletar usuário");
      }
      setMessage("Usuário deletado com sucesso.");
      onUserDeleted?.();
    } catch (e) {
      setMessage(e.message);
    }
  };

  if (!idUser) {
    return (
      <div className="container mt-5 alert alert-info">
        Nenhum usuário selecionado.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Deletar Usuário</h2>
      {message && (
        <div
          className={`alert ${
            message.includes("sucesso") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
      <p>
        Tem certeza que deseja deletar o usuário com ID{" "}
        <strong>{idUser}</strong> ?
      </p>
      <button className="btn btn-danger me-2" onClick={handleConfirm}>
        Sim, deletar
      </button>
      <button className="btn btn-secondary" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  );
}

DeleteUserPage.propTypes = {
  idUser: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onUserDeleted: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DeleteUserPage;
