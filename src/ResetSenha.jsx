import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ResetSenha.css";

 function ResetSenha() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // mensagem de erro / sucesso
  const [messageType, setMessageType] = useState("info"); // info, success, error

  useEffect(() => {
    // lê token da URL: /reset-password?token=...
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
    } else {
      setMessage("Token não fornecido na URL.");
      setMessageType("error");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage("Token ausente.");
      setMessageType("error");
      return;
    }
    if (!password || password.length < 6) {
      setMessage("Senha deve ter ao menos 6 caracteres.");
      setMessageType("error");
      return;
    }
    if (password !== confirm) {
      setMessage("As senhas não conferem.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const body = new URLSearchParams();
      body.append("token", token);
      body.append("newPassword", password);

      const resp = await fetch("http://localhost:8080/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (resp.status === 204 || resp.ok) {
        setMessage("Senha redefinida com sucesso! Redirecionando para login...");
        setMessageType("success");
        setTimeout(() => navigate("/"), 1200);
        return;
      }

      // tenta ler body (texto ou JSON)
      let text = await resp.text();
      try {
        const parsed = JSON.parse(text);
        text = parsed.message || parsed.error || text;
      } catch (err) {
        // texto simples
      }

      // tratar códigos específicos
      if (resp.status === 410) {
        // 410 GONE -> token expirado
        setMessage(text || "Token expirado.");
        setMessageType("error");
      } else if (resp.status === 429) {
        setMessage(text || "Muitas tentativas — token expirado por tentativas.");
        setMessageType("error");
      } else if (resp.status === 400) {
        setMessage(text || "Token inválido ou requisição inválida.");
        setMessageType("error");
      } else {
        setMessage(text || `Erro ao resetar: ${resp.status} ${resp.statusText}`);
        setMessageType("error");
      }
    } catch (err) {
      console.error("Erro ao chamar API:", err);
      setMessage("Erro de conexão com o servidor. Tente novamente.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-box">
        <h2 className="reset-title">Redefinir Senha</h2>

        {message && (
          <div className={`reset-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-form">
          <label className="reset-label">Novo Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="reset-input"
            placeholder="Digite a nova senha"
            required
            minLength={6}
            disabled={loading}
          />

          <label className="reset-label">Confirme a Senha</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="reset-input"
            placeholder="Repita a nova senha"
            required
            minLength={6}
            disabled={loading}
          />

          <button className="reset-btn" type="submit" disabled={loading}>
            {loading ? "Processando..." : "Resetar Senha"}
          </button>

          <button
            type="button"
            className="reset-back"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Voltar ao login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetSenha
