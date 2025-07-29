import { useEffect, useState } from "react";

const PedidosAdmin = () => {
  const [pendientes, setPendientes] = useState([]);
  const [surtidos, setSurtidos] = useState([]);
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  // 🔹 Obtener pedidos (sin filtros o con filtros dinámicos)
  const obtenerPedidos = async (url = "http://localhost:8080/api/tickets/historial") => {
    try {
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        const pend = data.tickets.filter(t => t.estado === "pendiente");
        const sur = data.tickets.filter(t => t.estado === "surtido");
        setPendientes(pend);
        setSurtidos(sur);
      } else {
        alert(data.message || "Error al cargar pedidos");
      }
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  // 🔹 Buscar pedidos surtidos por rango de fechas
  const buscarPorRango = async () => {
    if (!inicio || !fin) {
      alert("Selecciona ambas fechas");
      return;
    }

    const query = `?inicio=${inicio}&fin=${fin}`;
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/surtidos/rango${query}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setSurtidos(data.tickets); // ✅ Solo muestra los pedidos filtrados
        setPendientes([]);         // ✅ Oculta pendientes cuando se filtra
      } else {
        alert(data.message || "Error al buscar pedidos por rango");
      }
    } catch (error) {
      console.error("Error al buscar por rango:", error);
    }
  };

  // 🔹 Restablecer la lista completa
  const limpiarFiltros = () => {
    setInicio("");
    setFin("");
    obtenerPedidos(); // ✅ recarga todos los pedidos
  };

  // 🔹 Marcar un pedido como surtido
  const marcarSurtido = async (codigo) => {
    if (!window.confirm("¿Marcar este pedido como surtido?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/surtir/${codigo}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Pedido marcado como surtido");
        obtenerPedidos(); // ✅ refresca listas
      } else {
        alert(data.message || "Error al actualizar estado del pedido");
      }
    } catch (error) {
      console.error("Error al marcar surtido:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📦 Pedidos Pendientes</h1>

      {/* 🔹 Filtro por rango de fechas */}
      <h2 className="text-xl font-bold mt-6">🔍 Buscar pedidos surtidos</h2>
      <div className="flex gap-2 mb-4">
        <input 
          type="date" 
          value={inicio} 
          onChange={(e) => setInicio(e.target.value)} 
          className="border p-2 rounded" 
        />
        <input 
          type="date" 
          value={fin} 
          onChange={(e) => setFin(e.target.value)} 
          className="border p-2 rounded" 
        />
        <button 
          onClick={buscarPorRango} 
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
          Buscar
        </button>
        <button 
          onClick={limpiarFiltros} 
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
          Mostrar todo
        </button>
      </div>

      {/* 🔹 Lista de pedidos pendientes */}
      {pendientes.length === 0 ? (
        <p className="text-gray-500">No hay pedidos pendientes.</p>
      ) : (
        pendientes.map((t) => (
          <div key={t.codigo} className="border p-4 mb-3 rounded shadow">
            <h2 className="font-bold text-lg">🧾 Ticket: {t.codigo}</h2>
            <p>👤 Cliente: {t.comprador?.name || "Sin nombre"}</p>
            <p>📍 Dirección: {t.comprador?.address || "No disponible"}</p>
            <p>📞 Teléfono: {t.comprador?.phone || "No disponible"}</p>
            <p>💰 Total: ${t.total}</p>

            <h3 className="mt-2 font-semibold">Productos:</h3>
            <ul className="list-disc ml-5">
              {t.productos.map((p, idx) => (
                <li key={p.productoId?._id || idx}>
                  {p.productoId?.nombreComercial || "Producto eliminado"} - Cantidad: {p.cantidad}
                </li>
              ))}
            </ul>

            <button
              onClick={() => marcarSurtido(t.codigo)}
              className="bg-green-600 text-white px-4 py-2 mt-3 rounded hover:bg-green-700"
            >
              ✔️ Marcar como Surtido
            </button>
          </div>
        ))
      )}

      {/* 🔹 Historial de pedidos surtidos */}
      <h1 className="text-3xl font-bold mt-8 mb-4">📜 Historial de Pedidos Surtidos</h1>
      {surtidos.length === 0 ? (
        <p className="text-gray-500">No hay pedidos surtidos.</p>
      ) : (
        surtidos.map((t) => (
          <div key={t.codigo} className="border p-4 mb-3 rounded shadow bg-gray-100">
            <h2 className="font-bold text-lg">🧾 Ticket: {t.codigo}</h2>
            <p>👤 Cliente: {t.comprador?.name || "Sin nombre"}</p>
            <p>📍 Dirección: {t.comprador?.address || "No disponible"}</p>
            <p>📞 Teléfono: {t.comprador?.phone || "No disponible"}</p>
            <p>💰 Total: ${t.total}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PedidosAdmin;