// UpdateUserPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com(\.br)?|br|net|org)$/;

function UpdateUserPage({ onUserUpdated }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validate() {
    if (!name.trim()) {
      setMessage("Nome é obrigatório.");
      return false;
    }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setMessage("E-mail inválido.");
      return false;
    }
    if (password) {
      if (password.length < 6) {
        setMessage("Senha deve ter ao menos 6 caracteres.");
        return false;
      }
      if (password !== confirmPassword) {
        setMessage("Senhas não coincidem.");
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage("Usuário não autenticado.");
        setSubmitting(false);
        return;
      }

      const payload = {};
      if (name) payload.name = name.trim();
      if (email) payload.email = email.trim();
      if (password) payload.password = password;

      const resp = await fetch("http://localhost:8080/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // uso correto do template string:contentReference[oaicite:7]{index=7}
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        let err = `Erro ao atualizar (status ${resp.status})`;
        try {
          const parsed = JSON.parse(txt);
          err = parsed.message || parsed.error || err;
        } catch {}
        throw new Error(err);
      }

      setMessage("Atualização realizada com sucesso.");
      setPassword("");
      setConfirmPassword("");
      onUserUpdated?.();
    } catch (err) {
      setMessage(err.message || "Erro ao atualizar usuário.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Meu Perfil</h2>
      {message && (
        <div
          className={`alert ${
            message.toLowerCase().includes("sucesso")
              ? "alert-success"
              : "alert-danger"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            className="form-control"
            value={name} // **campo controlado com value e onChange**:contentReference[oaicite:8]{index=8}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email} // controlado
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="form-text">
            Use um e-mail válido (ex: usuario@dominio.com)
          </div>
        </div>

        <hr />

        <div className="mb-3">
          <label className="form-label">Nova senha (opcional)</label>
          <input
            type="password"
            className="form-control"
            value={password} // controlado
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirme a nova senha</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword} // controlado
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Atualizando..." : "Atualizar meus dados"}
        </button>
      </form>
    </div>
  );
}

UpdateUserPage.propTypes = {
  onUserUpdated: PropTypes.func,
};

export default UpdateUserPage;
