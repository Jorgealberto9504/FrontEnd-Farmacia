import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

function App() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [checkingSesion, setCheckingSesion] = useState(true);
  const [carrito, setCarrito] = useState(null);
  const [buscarAhora, setBuscarAhora] = useState(false); // 👉 nuevo estado

  useEffect(() => {
    const checkSesion = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/sessions/current", {
          credentials: "include",
        });
  
        if (res.ok) {
          const data = await res.json();
          console.log("Usuario autenticado:", data.user); // ✅ importante
          setUsuarioAutenticado(true);
          // Aquí también podrías guardar data.user si lo necesitas
  
          // Obtener carrito si está autenticado
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

  // 👉 Función para manejar búsqueda (Enter o click)
  const manejarBusqueda = (e) => {
    if (!e || (e.key && e.key === "Enter")) {
      setBuscarAhora(true); // 🔥 activa búsqueda
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
      />
      <div className="pt-20 px-4">
        <Routes>
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
              />
            }
          />
          <Route
  path="/login"
  element={<Login setUsuarioAutenticado={setUsuarioAutenticado} />}
/>
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={<Cart usuarioAutenticado={usuarioAutenticado} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

