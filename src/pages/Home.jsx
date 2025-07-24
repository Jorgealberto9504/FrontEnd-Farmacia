import { useEffect, useState } from "react";

const Home = ({
  terminoBusqueda,
  buscarAhora,
  setBuscarAhora,
  usuarioAutenticado,
  checkingSesion,
  setCarrito,
}) => {
  const [medicamentos, setMedicamentos] = useState([]);

  const obtenerMedicamentos = async (termino = "") => {
    try {
      const res = await fetch(`http://localhost:8080/api/products`);
      const data = await res.json();

      const todos = data.products || [];

      if (termino.trim() !== "") {
        const filtro = termino.toLowerCase();
        const filtrados = todos.filter((m) =>
          m.nombreComercial.toLowerCase().includes(filtro)
        );
        setMedicamentos(filtrados);
      } else {
        setMedicamentos(todos);
      }
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
    }
  };

  useEffect(() => {
    obtenerMedicamentos(); // carga todos al inicio
  }, []);

  useEffect(() => {
    if (buscarAhora) {
      obtenerMedicamentos(terminoBusqueda);
      setBuscarAhora(false);
    }
  }, [buscarAhora]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lista de Medicamentos</h2>
      {medicamentos.length === 0 ? (
        <p>No se encontraron medicamentos.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medicamentos.map((med, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <img
                src={med.imagen || "/imagen-default.png"}
                alt={med.nombreComercial}
                className="h-32 w-full object-cover mb-2"
              />
              <h3 className="font-semibold">{med.nombreComercial}</h3>
              <p className="text-sm text-gray-600">{med.descripcion}</p>
              <p className="text-blue-700 font-bold">${med.precio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;