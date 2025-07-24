// src/pages/Register.jsx
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: ""
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/sessions/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          ...formData, 
          role: "usuario" 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          phone: ""
        });
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;