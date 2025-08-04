// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import logo from "../assets/logo.png";

const socket = io("http://localhost:8080", { withCredentials: true });

const Navbar = ({
  terminoBusqueda,
  setBusqueda,
  manejarBusqueda,
  usuarioAutenticado,
  setUsuarioAutenticado,
  checkingSesion,
  carrito = [],
  setCarrito,
  setMostrarCarrito,
}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [pendientesCount, setPendientesCount] = useState(0);

  // ✅ Conectar al WebSocket y escuchar eventos de pedidos
  useEffect(() => {
    // 🔹 Cargar número inicial de pendientes
    const cargarPendientes = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/tickets/pendientes", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setPendientesCount(data.tickets.length);
      } catch (error) {
        console.error("Error al obtener pedidos pendientes:", error);
      }
    };
    cargarPendientes();

    // 🔹 Escuchar eventos en tiempo real
    socket.on("pedidoNuevo", () => {
      setPendientesCount((prev) => prev + 1);
    });

    socket.on("pedidoActualizado", () => {
      setPendientesCount((prev) => (prev > 0 ? prev - 1 : 0));
    });

    return () => {
      socket.off("pedidoNuevo");
      socket.off("pedidoActualizado");
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/sessions/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      setUsuarioAutenticado(false);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const productos = carrito?.productos || [];
  const total = productos.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </Link>

      {/* 🔹 Buscador */}
      <div className="flex flex-1 justify-center px-4">
        <input
          type="text"
          placeholder="Buscar medicamentos..."
          value={terminoBusqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && manejarBusqueda(e)}
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={() => manejarBusqueda({})}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      <div className="flex space-x-4 items-center">
        {/* 🔹 Si es admin mostrar botones */}
        {role === "admin" && (
          <>
            <Link to="/admin" className="text-purple-600 hover:underline font-semibold">
              Panel Admin
            </Link>
            <Link to="/admin/pedidos" className="relative text-green-600 hover:underline font-semibold">
              Pedidos
              {pendientesCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-1.5">
                  {pendientesCount}
                </span>
              )}
            </Link>
            <Link to="/admin/carousel" className="text-blue-500 hover:underline font-semibold">
              Carrusel
            </Link>
          </>
        )}

        {/* 🔹 Carrito */}
        <button
          onClick={() => setMostrarCarrito(true)}
          className="text-gray-700 text-xl hover:underline relative"
        >
          🛒
          {total > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5">
              {total}
            </span>
          )}
        </button>

        {/* 🔹 Login/Logout */}
        {!checkingSesion ? (
          usuarioAutenticado ? (
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">
                Iniciar sesión
              </Link>
              <Link to="/register" className="text-green-600 hover:underline">
                Registrarse
              </Link>
            </>
          )
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;