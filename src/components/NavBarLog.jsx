// src/components/NavBarLog.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function NavBarLog({
  onVisualizarUsuariosClick,
  onAdicionarUsuariosClick,
  onAddTaskClick,
  onViewTasksClick,
  onHomeClick,
  theme,
  onToggleTheme,
  onLogout,                 // recebido do App.jsx
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const isLoggedIn = !!token;

  const handleLogout = async (e) => {
    e.preventDefault();
    // chama seu endpoint de logout (opcional, pode remover se não quiser esperar)
    await fetch('http://localhost:8080/user/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('authToken');
    if (onLogout) onLogout();
    navigate('/');  // volta pra login
  };

  return (
    <nav
      className={`navbar navbar-expand-lg bg-${theme === 'light' ? 'light' : 'dark'}`}
      data-bs-theme={theme === 'light' ? 'light' : 'dark'}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={e => { e.preventDefault(); onHomeClick(); }}>
          Painel
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor02">
          {isLoggedIn && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={e => { e.preventDefault(); onHomeClick(); }}
                >
                  Início
                  <span className="visually-hidden">(current)</span>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Tarefas
                </a>
                <div className="dropdown-menu">
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={e => { e.preventDefault(); onAddTaskClick(); }}
                  >
                    Adicionar
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={e => { e.preventDefault(); onViewTasksClick(); }}
                  >
                    Visualizar
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/agenda">Agendas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/sobre">Sobre</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Monitoramento
                </a>
                <div className="dropdown-menu">
                  <div className="dropstart">
                    <a
                      className="dropdown-item dropdown-toggle"
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
                          onClick={e => {
                            e.preventDefault();
                            onAdicionarUsuariosClick?.();
                          }}
                        >
                          Adicionar Usuário
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            onVisualizarUsuariosClick?.();
                          }}
                        >
                          Visualizar Usuários
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/monitoramento/usuarios/atualizar">
                          Atualizar Usuário
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/monitoramento/usuarios/deletar">
                          Deletar Usuário
                        </a>
                      </li>
                    </ul>
                  </div>
                  <a className="dropdown-item" href="/monitoramento/agendas">
                    Agendas
                  </a>
                  <a className="dropdown-item" href="/monitoramento/erros">
                    Erros
                  </a>
                </div>
              </li>
            </ul>
          )}

          <form className="d-flex align-items-center gap-2">
            <a className="nav-link" href="/suporte">Suporte</a>
            <button
              className={`btn btn-outline-${theme === 'light' ? 'dark' : 'light'}`}
              type="button"
              onClick={onToggleTheme}
            >
              Modo {theme === 'light' ? 'Escuro' : 'Claro'}
            </button>
            {isLoggedIn && (
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
}

NavBarLog.propTypes = {
  onVisualizarUsuariosClick: PropTypes.func,
  onAdicionarUsuariosClick: PropTypes.func,
  onAddTaskClick:       PropTypes.func.isRequired,
  onViewTasksClick:     PropTypes.func.isRequired,
  onHomeClick:          PropTypes.func.isRequired,
  theme:                PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme:        PropTypes.func.isRequired,
  onLogout:             PropTypes.func,  // novo
};

export default NavBarLog;
