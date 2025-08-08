// src/components/NavBarLog.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";

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

  const handleThemeToggle = () => {
    setBulbOn(!bulbOn);
    onToggleTheme();
  };

  return (
    <nav
      className={`navbar navbar-expand-lg bg-${theme}`}
      data-bs-theme={theme}
    >
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
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
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
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  Usuários
                </a>
                <ul className="dropdown-menu">
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
              className={`btn btn-outline-${
                theme === "light" ? "dark" : "light"
              } me-2`}
              onClick={handleThemeToggle}
            >
              <FaLightbulb style={{ color: bulbOn ? "#FFD700" : "#888" }} />
            </button>
            {isLoggedIn && (
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  navigate("/");
                }}
              >
                Logout
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
