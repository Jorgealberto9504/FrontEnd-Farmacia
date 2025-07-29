import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import CarritoModal from "./components/CarritoModal";
import AdminPanel from "./pages/AdminPanel";
import PedidosAdmin from "./pages/PedidosAdmin"; // ✅ IMPORTACIÓN FALTANTE
import AdminCarousel from "./pages/AdminCarousel";


function App() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [checkingSesion, setCheckingSesion] = useState(true);
  const [carrito, setCarrito] = useState(false);
  const [buscarAhora, setBuscarAhora] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    const checkSesion = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/sessions/current", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Usuario autenticado:", data.user);
          setUsuarioAutenticado(true);

          const resCart = await fetch("http://localhost:8080/api/cart", {
            credentials: "include",
          });
          const dataCart = await resCart.json();
          setCarrito(dataCart.cart);
        } else {
          setUsuarioAutenticado(false);
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        setUsuarioAutenticado(false);
      } finally {
        setCheckingSesion(false);
      }
    };

    checkSesion();
  }, []);

  const manejarBusqueda = (e) => {
    if (!e || (e.key && e.key === "Enter")) {
      setBuscarAhora(true);
    }
  };

  return (
    <Router>
      <Navbar
        terminoBusqueda={terminoBusqueda}
        setBusqueda={setTerminoBusqueda}
        manejarBusqueda={manejarBusqueda}
        usuarioAutenticado={usuarioAutenticado}
        setUsuarioAutenticado={setUsuarioAutenticado}
        checkingSesion={checkingSesion}
        carrito={carrito}
        setCarrito={setCarrito}
        setMostrarCarrito={setMostrarCarrito}
      />

      <CarritoModal
        isOpen={mostrarCarrito}
        onClose={() => setMostrarCarrito(false)}
        carrito={carrito}
        setCarrito={setCarrito}
      />

      <div className="pt-20 px-4">
        <Routes>
        <Route path="/admin/carousel" element={<AdminCarousel />} />
          <Route path="/admin/pedidos" element={<PedidosAdmin />} /> 
          <Route path="/admin" element={<AdminPanel usuarioAutenticado={usuarioAutenticado} />} />
          <Route
            path="/"
            element={
              <Home
                terminoBusqueda={terminoBusqueda}
                buscarAhora={buscarAhora}
                setBuscarAhora={setBuscarAhora}
                usuarioAutenticado={usuarioAutenticado}
                checkingSesion={checkingSesion}
                setCarrito={setCarrito}
                carrito={carrito}
              />
            }
          />
          <Route path="/login" element={<Login setUsuarioAutenticado={setUsuarioAutenticado} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart usuarioAutenticado={usuarioAutenticado} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;