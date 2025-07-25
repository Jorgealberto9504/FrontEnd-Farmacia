// src/components/CarritoModal.jsx
import React from "react";

const CarritoModal = ({ isOpen, onClose, carrito, setCarrito }) => {
  if (!isOpen) return null;

  const productos = carrito?.productos || [];

  // 🔹 Calcular total
  const total = productos.reduce(
    (acc, item) => acc + (item.productoId?.precio || 0) * item.cantidad,
    0
  );

  // 🔹 Eliminar producto
  const eliminarProducto = async (codigo) => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${codigo}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Producto eliminado del carrito");
        setCarrito(data.cart);
      } else {
        alert(data.message || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar producto");
    }
  };

  // 🔹 Finalizar compra
  const finalizarCompra = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cart/purchase", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Compra realizada con éxito. Código de ticket: " + data.ticket.codigo);
        setCarrito({ productos: [] }); // 🔥 vacía el carrito en frontend
        onClose();
      } else {
        alert(data.message || "Error en la compra");
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      alert("Error al finalizar la compra");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">🛒 Carrito</h2>

        {productos.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          productos.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-2 border-b pb-2">
              <span>{item.productoId?.nombreComercial || "Producto sin nombre"}</span>
              <span className="text-sm text-gray-500">Cantidad: {item.cantidad}</span>
              <button
                onClick={() => eliminarProducto(item.productoId?.codigo)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
              >
                🗑 Eliminar
              </button>
            </div>
          ))
        )}

        {/* 🔹 Mostrar total */}
        {productos.length > 0 && (
          <p className="mt-3 font-bold text-right">💰 Total: ${total.toFixed(2)}</p>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Seguir comprando
          </button>

          {productos.length > 0 && (
            <button
              onClick={finalizarCompra}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ✅ Finalizar compra
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoModal;