import { useEffect, useState } from "react";

const AdminCarousel = () => {
  const [imagenes, setImagenes] = useState([]);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [link, setLink] = useState("");

  // ✅ Obtener imágenes
  const obtenerImagenes = async () => {
    const res = await fetch("http://localhost:8080/api/carousel");
    const data = await res.json();
    if (res.ok) setImagenes(data.images);
  };

  useEffect(() => {
    obtenerImagenes();
  }, []);

  // ✅ Subir nueva imagen
  const subirImagen = async (e) => {
    e.preventDefault();
    if (!nuevaImagen) return alert("Selecciona una imagen");

    const formData = new FormData();
    formData.append("imagen", nuevaImagen);
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("link", link);

    const res = await fetch("http://localhost:8080/api/carousel", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      alert("✅ Imagen subida al carrusel");
      setNuevaImagen(null);
      setTitulo("");
      setDescripcion("");
      setLink("");
      obtenerImagenes();
    } else {
      alert("❌ Error al subir la imagen");
    }
  };

  // ✅ Eliminar imagen
  const eliminarImagen = async (id) => {
    if (!window.confirm("¿Eliminar esta promoción?")) return;

    const res = await fetch(`http://localhost:8080/api/carousel/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("🗑️ Imagen eliminada");
      obtenerImagenes();
    } else {
      alert("❌ Error al eliminar");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🖼️ Gestionar Carrusel de Promociones</h2>

      {/* ✅ Formulario de subida */}
      <form onSubmit={subirImagen} className="mb-6 space-y-2">
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="border p-2 w-full rounded" required />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border p-2 w-full rounded" />
        <input type="text" placeholder="Link (opcional)" value={link} onChange={(e) => setLink(e.target.value)} className="border p-2 w-full rounded" />
        <input type="file" onChange={(e) => setNuevaImagen(e.target.files[0])} className="border p-2 w-full rounded" accept="image/*" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">➕ Subir Imagen</button>
      </form>

      {/* ✅ Lista de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {imagenes.map((img) => (
          <div key={img._id} className="border p-2 rounded shadow">
            <img src={`http://localhost:8080${img.imagen}`} alt={img.titulo} className="w-full h-40 object-cover mb-2 rounded" />
            <h3 className="font-bold">{img.titulo}</h3>
            <p className="text-sm text-gray-600">{img.descripcion}</p>
            <button onClick={() => eliminarImagen(img._id)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCarousel;