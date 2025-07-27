// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUsuarioAutenticado }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://localhost:8080/api/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // importante para cookies HttpOnly
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ guardar datos en localStorage
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userName", data.user.name);

        setUsuarioAutenticado(true);
        setMensaje("Inicio de sesión exitoso");

        // ✅ si es admin, redirigir a /admin
        navigate(data.user.role === "admin" ? "/admin" : "/");
      } else {
        setMensaje(data.message || "Credenciales inválidas");
      }
    } catch (error) {
      setMensaje("Error al iniciar sesión");
      console.error(error);
    }
  };

  return (
    <div className="pt-28 px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Iniciar sesión
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center text-red-600">{mensaje}</p>}
    </div>
  );
};

export default Login;