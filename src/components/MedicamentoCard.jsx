// src/components/MedicamentoCard.jsx
import React from "react";

const MedicamentoCard = ({ producto }) => {
  const handleAgregar = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/add/${producto.codigo}`, {
        method: "POST",
        credentials: "include", // importante para cookies HttpOnly
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Producto agregado al carrito");
        console.log("Carrito actualizado:", data.cart);
        // Aquí puedes actualizar el carrito en estado global si lo usas (como con Context)
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error de red al intentar agregar el producto.");
    }
  };

  return (
    <div className="border p-4 rounded shadow-md hover:shadow-lg">
      <img src={producto.imagen} alt={producto.nombreComercial} className="h-32 object-cover mb-2 mx-auto" />
      <h3 className="text-lg font-bold">{producto.nombreComercial}</h3>
      <p className="text-gray-700">${producto.precio}</p>
      <button
        onClick={handleAgregar}
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default MedicamentoCard;