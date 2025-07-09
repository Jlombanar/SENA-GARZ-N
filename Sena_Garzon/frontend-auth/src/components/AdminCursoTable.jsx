import { FaSearch, FaChalkboardTeacher } from "react-icons/fa";

const AdminCursoTable = ({
  cursos,
  onEdit,
  onDelete,
  onCreate,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaChalkboardTeacher className="text-green-700" />
          Lista de Cursos
        </h2>
        <button
          onClick={onCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nuevo Curso
        </button>
      </div>

      <div className="relative max-w-sm mx-auto mb-4">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="text-xs text-white uppercase bg-green-500 rounded">
            <tr>
              <th className="px-4 py-3 rounded-l-md">Imagen</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3 text-center rounded-r-md">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso._id} className="bg-gray-50 hover:bg-green-50 rounded transition">
                <td className="px-4 py-3">
                  {curso.imagen ? (
                    <img
                      src={`http://localhost:5000/uploads/${curso.imagen}`}
                      alt="curso"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{curso.nombre}</td>
                <td className="px-4 py-3 text-gray-700">{curso.cantidad}</td>
                <td className="px-4 py-3 text-gray-700">${curso.valor}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(curso)}
                    className="px-4 py-1 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(curso._id)}
                    className="px-4 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
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
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-green-500 text-white"
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

export default AdminCursoTable;
