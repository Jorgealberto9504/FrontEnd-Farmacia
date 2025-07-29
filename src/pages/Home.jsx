import { useEffect, useState } from "react";
import Carousel from "../components/Carousel"; 

const Home = ({
  terminoBusqueda,
  buscarAhora,
  setBuscarAhora,
  usuarioAutenticado,
  checkingSesion,
  setCarrito,
  carrito
}) => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [promociones, setPromociones] = useState([]); // ✅ Ahora vacío, se llenará desde la API

  // ✅ Obtener medicamentos
  const obtenerMedicamentos = async (termino = "") => {
    try {
      const res = await fetch(`http://localhost:8080/api/products`);
      const data = await res.json();
      const todos = data.products || [];

      if (termino.trim() !== "") {
        const filtro = termino.toLowerCase();
        setMedicamentos(todos.filter((m) => m.nombreComercial.toLowerCase().includes(filtro)));
      } else {
        setMedicamentos(todos);
      }
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
    }
  };

  // ✅ Obtener imágenes del carrusel y adaptarlas al formato del componente
  const obtenerPromociones = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/carousel");
      const data = await res.json();

      if (res.ok) {
        const imgs = (data.images || []).map(img => ({
          url: `http://localhost:8080${img.imagen}`,
          titulo: img.titulo,
          descripcion: img.descripcion,
          link: img.link
        }));
        setPromociones(imgs);
      }
    } catch (error) {
      console.error("Error al obtener promociones:", error);
    }
  };

  useEffect(() => {
    obtenerMedicamentos();
    obtenerPromociones(); // ✅ ahora sí se llama
  }, []);

  useEffect(() => {
    if (buscarAhora) {
      obtenerMedicamentos(terminoBusqueda);
      setBuscarAhora(false);
    }
  }, [buscarAhora]);

  // ✅ Agregar producto al carrito
  const agregarAlCarrito = async (producto) => {
    if (!usuarioAutenticado) {
      return alert("Debes iniciar sesión para agregar productos al carrito");
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/add/${producto.codigo}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Producto agregado al carrito");
        setCarrito(data.cart);
      } else {
        alert(data.message || "Error al agregar al carrito");
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <div>
      {/* ✅ Carrusel de Promociones */}
      {promociones.length > 0 && (
        <div className="mb-6">
          <Carousel images={promociones} />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Lista de Medicamentos</h2>
      {medicamentos.length === 0 ? (
        <p>No se encontraron medicamentos.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medicamentos.map((med, i) => {
            const cantidadEnCarrito =
              carrito?.productos?.find((p) => p.productoId?.codigo === med.codigo)?.cantidad || 0;
            const disponible = med.stock - cantidadEnCarrito;

            return (
              <div key={i} className="border p-4 rounded shadow">
                <img
                  src={med.imagen || "/imagen-default.png"}
                  alt={med.nombreComercial}
                  className="h-32 w-full object-cover mb-2"
                />
                <h3 className="font-semibold">{med.nombreComercial}</h3>
                <p className="text-sm text-gray-600">{med.descripcion}</p>
                <p className="text-blue-700 font-bold">${med.precio}</p>

                {disponible > 0 ? (
                  <button
                    onClick={() => agregarAlCarrito(med)}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full mt-2"
                  >
                    Agregar al carrito
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white py-2 px-4 rounded w-full mt-2 cursor-not-allowed"
                  >
                    No disponible
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;