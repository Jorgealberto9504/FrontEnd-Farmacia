// src/components/CarritoModal.jsx
import React from "react";

const CarritoModal = ({ isOpen, onClose, carrito }) => {
  if (!isOpen) return null;

  const productos = carrito?.productos || [];

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
          <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {productos.map((item, index) => (
              <li key={index} className="flex justify-between items-center border-b pb-1">
                <span>{item.productoId?.nombreComercial || "Producto"}</span>
                <span className="text-sm text-gray-600">Cantidad: {item.cantidad || 1}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end">
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