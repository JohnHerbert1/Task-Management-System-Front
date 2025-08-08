// src/components/AddTaskPage.jsx
import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// Opções de Status e Prioridade
const STATUS_OPTIONS = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluída" },
];
const PRIORITY_OPTIONS = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

function AddTaskPage({ onCreateTaskSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[0].value);
  const [message, setMessage] = useState("");

  // calcula hoje em ISO YYYY-MM-DD
  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !date || !hour) {
      setMessage("Todos os campos são obrigatórios!");
      return;
    }

    // valida formato e >= hoje
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) {
      setMessage(`Data inválida. Escolha ${today} ou posterior.`);
      return;
    }

    const newTask = {
      title,
      description,
      date,
      hour: hour + ":00",
      status,
      priority,
    };

    try {
      const resp = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.message || "Erro ao cadastrar tarefa");
      }

      const data = await resp.json();
      setMessage(`Tarefa "${data.title}" cadastrada com sucesso!`);
      // reset campos
      setTitle("");
      setDescription("");
      setDate("");
      setHour("");
      setStatus(STATUS_OPTIONS[0].value);
      setPriority(PRIORITY_OPTIONS[0].value);
      onCreateTaskSuccess?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cadastrar Nova Tarefa</h2>
      {message && (
        <div
          className={`alert ${
            message.includes("sucesso") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label">
            Título
          </label>
          <input
            type="text"
            className="form-control"
            id="taskTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        {/* Descrição */}
        <div className="mb-3">
          <label htmlFor="taskDescription" className="form-label">
            Descrição
          </label>
          <textarea
            className="form-control"
            id="taskDescription"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            required
          />
        </div>

        {/* Status & Prioridade */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="taskStatus" className="form-label">
              Status
            </label>
            <select
              id="taskStatus"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="taskPriority" className="form-label">
              Prioridade
            </label>
            <select
              id="taskPriority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data */}
        <div className="mb-3">
          <label htmlFor="taskDate" className="form-label">
            Data
          </label>
          <input
            type="date"
            className="form-control"
            id="taskDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            required
          />
          <small className="form-text text-muted">Data mínima: {today}</small>
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label htmlFor="taskHour" className="form-label">
            Hora
          </label>
          <input
            type="time"
            className="form-control"
            id="taskHour"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Cadastrar Tarefa
        </button>
      </form>
    </div>
  );
}

AddTaskPage.propTypes = {
  onCreateTaskSuccess: PropTypes.func,
};

export default AddTaskPage;
