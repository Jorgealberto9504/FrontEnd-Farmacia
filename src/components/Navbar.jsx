// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import CarritoModal from "./CarritoModal";

const Navbar = ({
    terminoBusqueda,
    setBusqueda,
    manejarBusqueda,
    usuarioAutenticado,
    setUsuarioAutenticado,
    checkingSesion,
    carrito = [],
  }) => {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = React.useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/sessions/logout", {
        method: "POST",
        credentials: "include",
      });
      setUsuarioAutenticado(false);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  const total = (carrito || []).reduce((sum, prod) => sum + prod.precio * prod.cantidad, 0);

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-700">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

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
          <button onClick={abrirModal} className="text-gray-700 text-xl hover:underline">
            🛒
          </button>

          {!checkingSesion ? (
            usuarioAutenticado ? (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
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

      <CarritoModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        carrito={carrito}
        total={total}
      />
    </>
  );
};

export default Navbar;