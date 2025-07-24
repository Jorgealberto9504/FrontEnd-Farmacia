// src/components/CarritoModal.jsx
import React from "react";

const CarritoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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

        {/* Aquí iría la lógica para mostrar los productos reales del carrito */}
        <p className="text-gray-600 mb-4">Aquí verás los productos que agregaste al carrito.</p>

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