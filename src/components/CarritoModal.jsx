import React from "react";

const CarritoModal = ({ isOpen, onClose, carrito, setCarrito }) => {
  if (!isOpen) return null;

  const productos = carrito?.productos || [];

  // 🔹 Eliminar producto del carrito
  const eliminarProducto = async (codigo) => {
    if (!codigo) {
      alert("Código de producto no encontrado");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${codigo}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Producto eliminado del carrito");
        setCarrito(data.cart); // 🔥 Actualiza el carrito global
      } else {
        alert(data.message || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar producto");
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
          productos.map((item) => {
            const producto = item.productoId || {};
            const codigo = producto.codigo || item.codigo;
            const nombre = producto.nombreComercial || "Producto sin nombre";

            return (
              <div key={item._id} className="flex justify-between items-center mb-2 border-b pb-2">
                <span>{nombre}</span>
                <span className="text-sm text-gray-500">Cantidad: {item.cantidad}</span>
                <button
                  onClick={() => eliminarProducto(codigo)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  🗑 Eliminar
                </button>
              </div>
            );
          })
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoModal;