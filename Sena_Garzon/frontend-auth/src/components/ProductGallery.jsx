import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";

const ProductGallery = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const observer = useRef();
  const limit = 6;

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/productos/productos-gallery?page=${page}&limit=${limit}`
        );

        const nuevos = res.data.productos;
        setProductos((prev) => {
          const idsPrevios = new Set(prev.map((p) => p._id));
          const sinDuplicados = nuevos.filter((p) => !idsPrevios.has(p._id));
          return [...prev, ...sinDuplicados];
        });

        setHasMore(nuevos.length === limit);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
      setLoading(false);
    };
    fetch();
  }, [page]);

  return (
    <section className="py-12 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Productos Destacados
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {productos.map((p, i) => {
          const ProductCard = (
            <div
              key={`${p._id}-${i}`}
              onClick={() => setSelected(p)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4"
            >
              <img
                src={`http://localhost:5000/uploads/${p.imagen}`}
                alt={p.nombre}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4">{p.nombre}</h3>
              <p className="text-gray-600">Cantidad: {p.cantidad}</p>
              <p className="text-green-600 font-bold text-lg">${p.valor}</p>
            </div>
          );

          return i === productos.length - 1 ? (
            <div ref={lastProductRef} key={`${p._id}-${i}`}>{ProductCard}</div>
          ) : (
            ProductCard
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-4">
          Cargando más productos...
        </p>
      )}

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
};

export default ProductGallery;
