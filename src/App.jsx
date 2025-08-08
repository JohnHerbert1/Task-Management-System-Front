// src/App.jsx
import React, { useState } from "react";
import BaseBoard from "./components/BaseBoard";
import NavBarLog from "./components/NavBarLog";

import AddTaskPage from "./components/AddTaskPage";
import ListTasksPage from "./components/ListTasksPage";
import UpdateTaskPage from "./components/UpdateTaskPage";
import DeleteTaskPage from "./components/DeleteTaskPage";

import ListUsersPage from "./components/ListUsersPage";
import UpdateUserPage from "./components/UpdateUserPage";
import DeleteUserPage from "./components/DeleteUserPage";

const PAGE_VIEWS = {
  HOME: "home",
  ADD_TASK: "addTask",
  VIEW_TASKS: "viewTasks",
  UPDATE_TASK: "updateTask",
  DELETE_TASK: "deleteTask",

  VIEW_USERS: "viewUsers",
  UPDATE_USER: "updateUser",
  DELETE_USER: "deleteUser",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGE_VIEWS.HOME);

  // tarefas
  const [taskToUpdateId, setTaskToUpdateId] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [shouldReloadTasks, setShouldReloadTasks] = useState(false);

  // usuários
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [shouldReloadUsers, setShouldReloadUsers] = useState(false);

  // tema
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // --- HANDLERS DE TAREFAS ---
  function handleShowAddTaskPage() {
    setCurrentPage(PAGE_VIEWS.ADD_TASK);
    setShouldReloadTasks(false);
  }
  function handleShowViewTasksPage() {
    setCurrentPage(PAGE_VIEWS.VIEW_TASKS);
    setShouldReloadTasks(true);
    setTaskToUpdateId(null);
    setTaskToDeleteId(null);
  }
  function handleEditTask(id) {
    setTaskToUpdateId(id);
    setCurrentPage(PAGE_VIEWS.UPDATE_TASK);
  }
  function handleDeleteTask(id) {
    setTaskToDeleteId(id);
    setCurrentPage(PAGE_VIEWS.DELETE_TASK);
  }
  function handleTaskDone() {
    setShouldReloadTasks(true);
    setCurrentPage(PAGE_VIEWS.VIEW_TASKS);
  }

  // --- HANDLERS DE USUÁRIOS ---
  function handleShowListUsersPage() {
    setCurrentPage(PAGE_VIEWS.VIEW_USERS);
    setShouldReloadUsers(true);
    setUserToDeleteId(null);
  }
  function handleShowUpdateUserPage() {
    setCurrentPage(PAGE_VIEWS.UPDATE_USER);
  }
  function handleDeleteUser(id) {
    setUserToDeleteId(id);
    setCurrentPage(PAGE_VIEWS.DELETE_USER);
  }
  function handleUserDone() {
    setShouldReloadUsers(true);
    setCurrentPage(PAGE_VIEWS.VIEW_USERS);
  }

  // HOME
  function handleHomeClick() {
    setCurrentPage(PAGE_VIEWS.HOME);
  }

  // RENDERIZA O CONTEÚDO PRINCIPAL
  function renderMainContent() {
    switch (currentPage) {
      // ===== TAREFAS =====
      case PAGE_VIEWS.ADD_TASK:
        return <AddTaskPage onCreateTaskSuccess={handleTaskDone} />;

      case PAGE_VIEWS.VIEW_TASKS:
        return (
          <ListTasksPage
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            shouldReload={shouldReloadTasks}
          />
        );

      case PAGE_VIEWS.UPDATE_TASK:
        if (!taskToUpdateId) {
          return (
            <div className="container mt-5 alert alert-info">
              Selecione uma tarefa para editar em{" "}
              <button
                className="btn btn-link p-0"
                onClick={handleShowViewTasksPage}
              >
                Visualizar Tarefas
              </button>
              .
            </div>
          );
        }
        return (
          <UpdateTaskPage
            idTask={taskToUpdateId}
            onUpdateTaskSuccess={handleTaskDone}
          />
        );

      case PAGE_VIEWS.DELETE_TASK:
        if (!taskToDeleteId) {
          return (
            <div className="container mt-5 alert alert-info">
              Selecione uma tarefa para apagar em{" "}
              <button
                className="btn btn-link p-0"
                onClick={handleShowViewTasksPage}
              >
                Visualizar Tarefas
              </button>
              .
            </div>
          );
        }
        return (
          <DeleteTaskPage
            idTask={taskToDeleteId}
            onTaskDeleted={handleTaskDone}
            onCancel={handleTaskDone}
          />
        );

      // ===== USUÁRIOS =====
      case PAGE_VIEWS.VIEW_USERS:
        return (
          <ListUsersPage
            onDeleteUser={handleDeleteUser}
            shouldReload={shouldReloadUsers}
          />
        );

      case PAGE_VIEWS.UPDATE_USER:
        return <UpdateUserPage onUserUpdated={handleUserDone} />;

      case PAGE_VIEWS.DELETE_USER:
        if (!userToDeleteId) {
          return (
            <div className="container mt-5 alert alert-info">
              Selecione um usuário para deletar em{" "}
              <button
                className="btn btn-link p-0"
                onClick={handleShowListUsersPage}
              >
                Visualizar Usuários
              </button>
              .
            </div>
          );
        }
        return (
          <DeleteUserPage
            idUser={userToDeleteId}
            onUserDeleted={handleUserDone}
            onCancel={handleUserDone}
          />
        );

      // ===== HOME =====
      case PAGE_VIEWS.HOME:
      default:
        return (
          <div
            className={`container mt-5 text-${
              theme === "light" ? "dark" : "light"
            }`}
          >
            <h1>Bem-vindo ao Gerenciador de Tarefas!</h1>
            <p>Selecione uma opção no menu acima para começar.</p>
            <div className="text-center mt-4">
              <img
                src="/imgs/darksouls.gif"
                alt="Dark Souls Bonfire"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        );
    }
  }

  return (
    <div
      className={`bg-${theme}`}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <NavBarLog
        onHomeClick={handleHomeClick}
        onAddTaskClick={handleShowAddTaskPage}
        onViewTasksClick={handleShowViewTasksPage}
        onVisualizarUsuariosClick={handleShowListUsersPage}
        onAtualizarUsuariosClick={handleShowUpdateUserPage}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      <div style={{ flexGrow: 1 }}>{renderMainContent()}</div>
      <BaseBoard theme={theme} />
    </div>
  );
}
