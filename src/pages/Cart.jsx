import { useState, useEffect } from "react";

const Cart = () => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [checkingSesion, setCheckingSesion] = useState(true);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const verificarSesionYCart = async () => {
      try {
        const resSesion = await fetch("http://localhost:8080/api/sessions/current", {
          credentials: "include",
        });

        const dataSesion = await resSesion.json();
        if (dataSesion.user) {
          setUsuarioAutenticado(true);

          // Obtener el carrito del usuario
          const resCart = await fetch("http://localhost:8080/api/cart", {
            credentials: "include",
          });

          const dataCart = await resCart.json();
          if (dataCart.cart && dataCart.cart.productos) {
            setProductos(dataCart.cart.productos);
          }
        }
      } catch (error) {
        setUsuarioAutenticado(false);
      } finally {
        setCheckingSesion(false);
      }
    };

    verificarSesionYCart();
  }, []);

  return (
    <div>
      {checkingSesion ? (
        <p>Cargando sesión...</p>
      ) : usuarioAutenticado ? (
        <div>
          <h2>Carrito de compras</h2>
          {productos.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            <ul>
              {productos.map((item, index) => (
                <li key={index}>
                  Producto ID: {item.productoId} — Cantidad: {item.cantidad}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Debes iniciar sesión para ver el carrito.</p>
      )}
    </div>
  );
};

export default Cart;