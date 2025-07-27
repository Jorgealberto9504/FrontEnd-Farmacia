import { useEffect, useState } from "react";

const PedidosAdmin = () => {
  const [pendientes, setPendientes] = useState([]);
  const [surtidos, setSurtidos] = useState([]);

  // 🔹 Obtener pedidos del backend
  const obtenerPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tickets/historial", {
        credentials: "include",
      });
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

  // 🔹 Marcar como surtido
  const marcarSurtido = async (id) => {
    if (!window.confirm("¿Marcar este pedido como surtido?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/marcar-surtido/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Pedido marcado como surtido");
        obtenerPedidos();
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
              onClick={() => marcarSurtido(t._id)}
              className="bg-green-600 text-white px-4 py-2 mt-3 rounded hover:bg-green-700"
            >
              ✔️ Marcar como Surtido
            </button>
          </div>
        ))
      )}

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