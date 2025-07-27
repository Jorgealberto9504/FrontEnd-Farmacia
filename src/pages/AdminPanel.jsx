// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";

const AdminPanel = ({ usuarioAutenticado }) => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombreComercial: "",
    sustanciaActiva: "",
    descripcion: "",
    precio: "",
    codigo: "",
    stock: "",
    categoria: "Antihistamínico",
    tipoVenta: "Libre",
    laboratorio: "",
    imagen: ""
  });

  // ✅ Cargar productos existentes
  const obtenerProductos = async () => {
    const res = await fetch("http://localhost:8080/api/products");
    const data = await res.json();
    setProductos(data.products || []);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ✅ Crear producto
  const crearProducto = async () => {
    if (!nuevoProducto.nombreComercial || !nuevoProducto.codigo) {
      return alert("Por favor, completa todos los campos obligatorios");
    }

    try {
      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(nuevoProducto)
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Producto creado correctamente");
        obtenerProductos();
        // 🔄 Limpia el formulario
        setNuevoProducto({
          nombreComercial: "",
          sustanciaActiva: "",
          descripcion: "",
          precio: "",
          codigo: "",
          stock: "",
          categoria: "Antihistamínico",
          tipoVenta: "Libre",
          laboratorio: "",
          imagen: ""
        });
      } else {
        alert(data.message || "❌ Error al crear producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de conexión al servidor");
    }
  };

  // ✅ Eliminar producto
  const eliminarProducto = async (codigo) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/products/${codigo}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("🗑️ Producto eliminado");
        obtenerProductos();
      } else {
        alert(data.message || "❌ Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📦 Panel de Administración</h1>

      {/* Formulario para crear productos */}
      <div className="border p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">➕ Crear Producto</h2>

        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Nombre Comercial" value={nuevoProducto.nombreComercial}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombreComercial: e.target.value })} className="border p-2 rounded" />
          
          <input type="text" placeholder="Sustancia Activa" value={nuevoProducto.sustanciaActiva}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, sustanciaActiva: e.target.value })} className="border p-2 rounded" />

          <input type="text" placeholder="Descripción" value={nuevoProducto.descripcion}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} className="border p-2 rounded" />

          <input type="number" placeholder="Precio" value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} className="border p-2 rounded" />

          <input type="text" placeholder="Código" value={nuevoProducto.codigo}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })} className="border p-2 rounded" />

          <input type="number" placeholder="Stock" value={nuevoProducto.stock}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} className="border p-2 rounded" />

          {/* 🔹 Select de Categoría */}
          <select value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} className="border p-2 rounded">
            <option value="Antihistamínico">Antihistamínico</option>
            <option value="Analgésico">Analgésico</option>
            <option value="Antibiótico">Antibiótico</option>
            <option value="Otro">Otro</option>
          </select>

          {/* 🔹 Select de Tipo de Venta */}
          <select value={nuevoProducto.tipoVenta} onChange={(e) => setNuevoProducto({ ...nuevoProducto, tipoVenta: e.target.value })} className="border p-2 rounded">
            <option value="Libre">Libre</option>
            <option value="Receta">Receta</option>
          </select>

          <input type="text" placeholder="Laboratorio" value={nuevoProducto.laboratorio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, laboratorio: e.target.value })} className="border p-2 rounded" />

          <input type="text" placeholder="URL Imagen" value={nuevoProducto.imagen}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })} className="border p-2 rounded" />
        </div>

        <button onClick={crearProducto} className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700">
          ✅ Crear Producto
        </button>
      </div>

      {/* Lista de productos */}
      <h2 className="text-2xl font-bold mb-2">📋 Lista de Productos</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.codigo} className="border-b">
              <td>{p.nombreComercial}</td>
              <td>{p.codigo}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">✏️ Editar</button>
                <button onClick={() => eliminarProducto(p.codigo)} className="bg-red-500 text-white px-2 py-1 rounded">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;