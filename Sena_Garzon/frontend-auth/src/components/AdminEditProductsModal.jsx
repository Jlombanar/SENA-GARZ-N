import { useState, useEffect } from "react";

const AdminEditProductsModal = ({
  product,
  onClose,
  onChange,
  onSave,
  onCreate,
  isEditing,
}) => {
  if (!product) return null;

  const [previewImage, setPreviewImage] = useState(
    product.imagen && typeof product.imagen === 'string'
      ? `http://localhost:5000/uploads/${product.imagen}`
      : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      onChange({ ...product, imagen: file });
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      onSave();
    } else {
      onCreate();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={product.nombre}
            onChange={(e) => onChange({ ...product, nombre: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="Nombre del producto"
          />
          <input
            type="number"
            value={product.cantidad}
            onChange={(e) => onChange({ ...product, cantidad: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="Cantidad"
          />
          <input
            type="number"
            value={product.valor}
            onChange={(e) => onChange({ ...product, valor: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="valor"
          />

          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="Vista previa"
              className="mt-2 w-full h-40 object-cover rounded border"
            />
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isEditing ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProductsModal;