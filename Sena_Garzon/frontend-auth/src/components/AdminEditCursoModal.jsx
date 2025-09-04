import { useState } from "react";

const AdminEditCursoModal = ({
  curso,
  onClose,
  onChange,
  onSave,
  onCreate,
  isEditing,
}) => {
  if (!curso) return null;

  const [previewImage, setPreviewImage] = useState(
    curso.imagen && typeof curso.imagen === 'string'
      ? `http://localhost:5000/uploads/${curso.imagen}`
      : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      onChange({ ...curso, imagen: file });
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
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {isEditing ? "Editar Curso" : "Nuevo Curso"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={curso.nombre}
            onChange={(e) => onChange({ ...curso, nombre: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Nombre del curso"
          />
          <input
            type="number"
            value={curso.cantidad}
            onChange={(e) => onChange({ ...curso, cantidad: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Cantidad"
          />
          <input
            type="number"
            value={curso.valor}
            onChange={(e) => onChange({ ...curso, valor: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Valor"
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {isEditing ? "Guardar Cambios" : "Crear Curso"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditCursoModal;
