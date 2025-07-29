import { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  // ⏩ Cambio automático cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
      {/* Imagen */}
      <img
        src={images[current].url}
        alt={`promo-${current}`}
        className="w-full h-64 object-cover transition-all duration-700"
      />

      {/* Botones Manuales */}
      <button
        onClick={() => setCurrent((current - 1 + images.length) % images.length)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrent((current + 1) % images.length)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
      >
        ❯
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-2 w-full flex justify-center gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;