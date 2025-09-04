const AdminEditUserModal = ({
  selectedUser,
  onClose,
  onChange,
  onSave,
}) => {
  if (!selectedUser) return null;

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
          Editar Usuario
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={selectedUser.nombre}
            onChange={(e) => onChange({ ...selectedUser, nombre: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="Nombre"
          />
          <input
            type="email"
            value={selectedUser.correo}
            onChange={(e) => onChange({ ...selectedUser, correo: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="Correo"
          />
          <select
            value={selectedUser.rol}
            onChange={(e) => onChange({ ...selectedUser, rol: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUserModal;
