// src/components/MedicamentoCard.jsx
import React from "react";

const MedicamentoCard = ({ producto }) => {
  const handleAgregar = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/add/${producto.codigo}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Producto agregado al carrito");
        console.log("Carrito actualizado:", data.cart);
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error de red al intentar agregar el producto.");
    }
  };

  return (
    <div className="border p-4 rounded shadow-md hover:shadow-lg flex flex-col">
      {/* ✅ Imagen ajustada sin recorte */}
      <div className="w-full h-56 bg-white flex justify-center items-center mb-2 rounded">
        <img
          src={producto.imagen}
          alt={producto.nombreComercial}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* ✅ Info del producto */}
      <h3 className="text-lg font-bold text-center">{producto.nombreComercial}</h3>
      <p className="text-gray-700 text-center">${producto.precio}</p>

      {/* ✅ Botón de acción */}
      <button
        onClick={handleAgregar}
        className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default MedicamentoCard;