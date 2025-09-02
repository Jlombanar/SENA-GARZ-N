import { FaUsers, FaSearch } from "react-icons/fa";

const AdminUserTable = ({
  usuarios,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-6xl mx-auto mt-10 border border-green-100">
      <h2 className="text-3xl font-extrabold text-green-700 mb-8 text-center flex items-center justify-center gap-3">
        <FaUsers className="text-green-600" /> Usuarios registrados
      </h2>

      <div className="relative max-w-md mx-auto mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="bg-green-600 text-white text-sm">
            <tr>
              <th className="px-4 py-3 rounded-l-md">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-center rounded-r-md">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u._id}
                className="bg-gray-50 hover:bg-green-50 rounded-xl transition shadow-sm"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{u.nombre}</td>
                <td className="px-4 py-3 text-gray-700">{u.correo}</td>
                <td className="px-4 py-3 capitalize text-gray-700">{u.rol}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="px-4 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(u._id)}
                    className="px-4 py-1 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded-full font-semibold ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserTable;
