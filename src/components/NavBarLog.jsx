// src/components/NavBarLog.jsx
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";

/**
 * NavBarLog
 * - Recebe callbacks para navegação (onHomeClick, onAddTaskClick, ...)
 * - Lê token do localStorage (chave "authToken")
 * - Decodifica payload do JWT (sem validação) e verifica roles (roles || authorities)
 * - Mostra "Visualizar Usuários" somente se houver ROLE_ADMIN no token
 *
 * Props obrigatórias: onHomeClick, onAddTaskClick, onViewTasksClick,
 * onVisualizarUsuariosClick, onAtualizarUsuariosClick, onToggleTheme, theme
 */
export default function NavBarLog({
  onHomeClick,
  onAddTaskClick,
  onViewTasksClick,
  onVisualizarUsuariosClick,
  onAtualizarUsuariosClick,
  onToggleTheme,
  theme,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;
  const [bulbOn, setBulbOn] = useState(theme === "dark");

  // decode JWT payload (no verification) safely
  const parseJwt = (jwt) => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      // atob may throw if invalid; decodeURIComponent handles UTF-8
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // memoize roles check to avoid re-decoding
  const isAdmin = useMemo(() => {
    if (!token) return false;
    const payload = parseJwt(token);
    if (!payload) return false;
    // try common claim names
    const roles = payload.roles || payload.authorities || payload.authority || [];
    // roles can be string or array depending on implementation
    if (Array.isArray(roles)) {
      return roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");
    }
    if (typeof roles === "string") {
      return roles === "ROLE_ADMIN" || roles === "ADMIN" || roles.split(",").includes("ROLE_ADMIN");
    }
    return false;
  }, [token]);

  const handleThemeToggle = () => {
    setBulbOn(!bulbOn);
    onToggleTheme();
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-${theme}`} data-bs-theme={theme}>
      <div className="container-fluid">
        <a
          className="navbar-brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onHomeClick();
          }}
        >
          Painel
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isLoggedIn && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onHomeClick();
                  }}
                >
                  Início
                </a>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                  Tarefas
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onAddTaskClick();
                      }}
                    >
                      Adicionar
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onViewTasksClick();
                      }}
                    >
                      Visualizar
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                  Usuários
                </a>
                <ul className="dropdown-menu">
                  {/* Só mostra "Visualizar Usuários" para admins */}
                  {isAdmin && (
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onVisualizarUsuariosClick();
                        }}
                      >
                        Visualizar Usuários
                      </a>
                    </li>
                  )}

                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onAtualizarUsuariosClick();
                      }}
                    >
                      Atualizar Usuário
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          )}

          <div className="d-flex align-items-center">
            <button
              className={`btn btn-outline-${theme === "light" ? "dark" : "light"} me-2`}
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              <FaLightbulb style={{ color: bulbOn ? "#FFD700" : "#888" }} />
            </button>

            {isLoggedIn ? (
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  navigate("/");
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

NavBarLog.propTypes = {
  onHomeClick: PropTypes.func.isRequired,
  onAddTaskClick: PropTypes.func.isRequired,
  onViewTasksClick: PropTypes.func.isRequired,
  onVisualizarUsuariosClick: PropTypes.func.isRequired,
  onAtualizarUsuariosClick: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
};
