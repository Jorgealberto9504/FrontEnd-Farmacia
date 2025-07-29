import { useEffect, useState } from "react";

const AdminPanel = ({ usuarioAutenticado }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [editData, setEditData] = useState({});
  const [imagenEdit, setImagenEdit] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombreComercial: "",
    sustanciaActiva: "",
    descripcion: "",
    precio: "",
    codigo: "",
    stock: "",
    categoria: "",
    tipoVenta: "",
    laboratorio: ""
  });
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const categorias = ["Analgésico", "Antibiótico", "Antiinflamatorio", "Vitaminas", "Otro"];
  const tiposVenta = ["Libre", "Con receta"];

  // ✅ Obtener productos
  const obtenerProductos = async () => {
    const res = await fetch("http://localhost:8080/api/products");
    const data = await res.json();
    setProductos(data.products || []);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ✅ Crear producto con imagen
  const crearProducto = async () => {
    try {
      const formData = new FormData();
      Object.keys(nuevoProducto).forEach((key) => formData.append(key, nuevoProducto[key]));
      if (nuevaImagen) formData.append("imagen", nuevaImagen);

      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Producto creado correctamente");
        obtenerProductos();
        setNuevoProducto({
          nombreComercial: "",
          sustanciaActiva: "",
          descripcion: "",
          precio: "",
          codigo: "",
          stock: "",
          categoria: "",
          tipoVenta: "",
          laboratorio: ""
        });
        setNuevaImagen(null);
      } else {
        alert(data.message || "Error al crear producto");
      }
    } catch (error) {
      console.error("Error:", error);
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
        alert(data.message || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Guardar edición con imagen opcional
  const guardarEdicion = async () => {
    try {
      const formData = new FormData();
      Object.keys(editData).forEach((key) => formData.append(key, editData[key]));
      if (imagenEdit) formData.append("imagen", imagenEdit);

      const res = await fetch(`http://localhost:8080/api/products/${productoEditando.codigo}`, {
        method: "PUT",
        credentials: "include",
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Producto actualizado");
        setProductoEditando(null);
        setImagenEdit(null);
        obtenerProductos();
      } else {
        alert(data.message || "Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombreComercial.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.sustanciaActiva.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📦 Panel de Administración</h1>

      {/* ✅ Crear Producto */}
      <div className="border p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">➕ Crear Producto</h2>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Nombre Comercial" value={nuevoProducto.nombreComercial} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombreComercial: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Sustancia Activa" value={nuevoProducto.sustanciaActiva} onChange={(e) => setNuevoProducto({ ...nuevoProducto, sustanciaActiva: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} className="border p-2 rounded" />

          {/* ✅ Selects */}
          <select value={nuevoProducto.tipoVenta} onChange={(e) => setNuevoProducto({ ...nuevoProducto, tipoVenta: e.target.value })} className="border p-2 rounded">
            <option value="">Tipo de Venta</option>
            {tiposVenta.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} className="border p-2 rounded">
            <option value="">Categoría</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input type="text" placeholder="Laboratorio" value={nuevoProducto.laboratorio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, laboratorio: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Stock" value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Código" value={nuevoProducto.codigo} onChange={(e) => setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })} className="border p-2 rounded" />

          {/* ✅ Input Imagen */}
          <input type="file" onChange={(e) => setNuevaImagen(e.target.files[0])} className="border p-2 rounded" />
        </div>
        <button onClick={crearProducto} className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700">Crear Producto</button>
      </div>

      {/* ✅ Lista de Productos */}
      <h2 className="text-2xl font-bold mb-2">📋 Lista de Productos</h2>
      <input type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="border p-2 rounded mb-3 w-full max-w-md" />

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
          {productosFiltrados.map((p) => (
            <tr key={p.codigo} className="border-b">
              <td>{p.nombreComercial}</td>
              <td>{p.codigo}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => { setProductoEditando(p); setEditData(p); }} className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">✏️ Editar</button>
                <button onClick={() => eliminarProducto(p.codigo)} className="bg-red-500 text-white px-2 py-1 rounded">🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal de Edición */}
      {productoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">✏️ Editar Producto</h2>

            {/* ✅ Imagen actual del producto */}
            {editData.imagen ? (
  <img
    src={editData.imagen.startsWith("http") ? editData.imagen : `http://localhost:8080${editData.imagen}`}
    alt="Imagen actual"
    className="w-32 h-32 object-cover mb-2 border"
  />
) : (
  <p className="text-gray-500 mb-2">No hay imagen disponible</p>
)}

            {/* ✅ Subir nueva imagen */}
            <label>Imagen nueva:</label>
            <input type="file" onChange={(e) => setImagenEdit(e.target.files[0])} className="border p-2 rounded w-full mb-2" />

            {/* ✅ Inputs de edición */}
            {Object.keys(editData).map((key) =>
              ["imagen", "_id", "__v", "createdAt", "updatedAt"].includes(key) ? null : (
                <input key={key} type={key === "precio" || key === "stock" ? "number" : "text"} className="border p-2 rounded w-full mb-2" value={editData[key] || ""} onChange={(e) => setEditData({ ...editData, [key]: e.target.value })} />
              )
            )}

            <div className="flex justify-end gap-2">
              <button onClick={guardarEdicion} className="bg-green-600 text-white px-4 py-2 rounded">💾 Guardar</button>
              <button onClick={() => setProductoEditando(null)} className="bg-gray-400 text-white px-4 py-2 rounded">❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;