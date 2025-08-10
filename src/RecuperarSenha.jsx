// src/RecuperarSenha.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/RecuperarSenha.css";

function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      // Envia o POST com x-www-form-urlencoded (o backend espera @RequestParam)
      const body = new URLSearchParams();
      body.append("email", email);

      const resp = await fetch("http://localhost:8080/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (resp.ok || resp.status === 202) {
        // mostra mensagem e volta ao login
        alert("Link enviado! Verifique seu e-mail.");
        // voltar para login após um curto delay (dá tempo pro usuário ver o alerta)
        setTimeout(() => navigate("/"), 700);
      } else {
        // tenta ler mensagem de erro se houver
        let text = await resp.text();
        try {
          const parsed = JSON.parse(text);
          text = parsed.message || parsed.error || text;
        } catch {}
        alert("Erro ao enviar link: " + (text || resp.statusText));
      }
    } catch (err) {
      console.error("Erro ao chamar API:", err);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-wrapper">
      <div className="recuperar-box">
        <h1 className="recuperar-title">Recuperar Senha</h1>

        <form onSubmit={handleSubmit}>
          <div className="recuperar-field">
            <label htmlFor="email" className="recuperar-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="recuperar-input"
              placeholder="Digite seu email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="recuperar-submit-btn"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Link de Recuperação"}
          </button>

          <p onClick={() => navigate("/")} className="recuperar-back-text">
            Voltar para o login
          </p>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;
