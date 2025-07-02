const ProductModal = ({ product, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <img
          src={`http://localhost:5000/uploads/${product.imagen}`}
          alt={product.nombre}
          className="w-full h-60 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{product.nombre}</h2>
        <p className="text-gray-700 mb-2">Cantidad disponible: {product.cantidad}</p>
        <p className="text-green-700 font-bold text-xl mb-4">${product.valor}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Cerrar
          </button>
          <button
            onClick={() => alert("Compra simulada")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
