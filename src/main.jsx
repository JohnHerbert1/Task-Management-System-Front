// src/index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import TelaLogin from "./TelaLogin.jsx";
import RecuperarSenha from "./RecuperarSenha.jsx";
import CadastroUsers from "./CadastroUsers.jsx";
import Agenda from "./Agenda.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/morph/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const router = createBrowserRouter([
  { path: "/", element: <TelaLogin /> },
  { path: "/cadastro", element: <CadastroUsers /> },
  { path: "/recuperar-senha", element: <RecuperarSenha /> },

  {
    element: <PrivateRoute />,
    children: [
      { path: "/home", element: <App /> },
      { path: "/agenda", element: <Agenda /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
