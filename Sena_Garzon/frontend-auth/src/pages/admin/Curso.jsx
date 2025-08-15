import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminCursoTable from "../../components/AdminCursoTable";
import AdminEditCursoModal from "../../components/AdminEditCursoModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CursoList = () => {
  const [cursos, setCurso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedCursoLikes, setSelectedCursoLikes] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos"); // Nuevo estado para filtros
  const itemsPerPage = 5;

  const fetchCurso = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cursos");
      setCurso(res.data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      toast.error("Error al obtener cursos");
    } finally {
      setLoading(false);
    }
  };

  const eliminarCurso = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el curso permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/cursos/${id}`);
        setCurso((prev) => prev.filter((c) => c._id !== id));
        toast.success("Curso eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar curso:", error);
        toast.error("Error al eliminar curso");
      }
    }
  };

  const openEditModal = (curso) => {
    setSelectedCurso(curso);
    setShowModal(true);
  };

  const openLikesModal = (curso) => {
    setSelectedCursoLikes(curso);
    setShowLikesModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", selectedCurso.nombre);
      formData.append("cantidad", selectedCurso.cantidad);
      formData.append("valor", selectedCurso.valor);
      if (selectedCurso.imagen instanceof File) {
        formData.append("imagen", selectedCurso.imagen);
      }

      const res = await axios.put(
        `http://localhost:5000/api/curso/${selectedCurso._id}`,
        formData
      );

      const updatedCurso = res.data.curso;
      setCurso((prev) =>
        prev.map((c) => (c._id === updatedCurso._id ? updatedCurso : c))
      );

      setShowModal(false);
      setSelectedCurso(null);
      toast.success("Curso actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      toast.error("Error al actualizar curso");
    }
  };

  // Funciones para filtrar cursos
  const handleFilterCursos = (filterType) => {
    setActiveFilter(filterType);
    setCurrentPage(1); // Resetear a la primera página
  };

  const getFilteredCursos = () => {
    let filtered = cursos;
    
    // Aplicar filtro según el tipo seleccionado
    switch (activeFilter) {
      case "conLikes":
        filtered = cursos.filter(curso => curso.likes && curso.likes.length > 0);
        break;
      case "conInscripciones":
        filtered = cursos.filter(curso => curso.inscritos && curso.inscritos.length > 0);
        break;
      case "todos":
      default:
        filtered = cursos;
        break;
    }
    
    // Aplicar búsqueda de texto
    if (search) {
      filtered = filtered.filter((c) =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    fetchCurso();
  }, []);

  const filteredCursos = getFilteredCursos();
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
  const paginatedCurso = filteredCursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Gestión de Cursos</h1>
        <button
          onClick={() => fetchCurso()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Estadísticas de likes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => handleFilterCursos("todos")}
          className={`bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer ${
            activeFilter === "todos" ? "ring-2 ring-blue-300 bg-blue-50" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{cursos.length}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleFilterCursos("conLikes")}
          className={`bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer ${
            activeFilter === "conLikes" ? "ring-2 ring-purple-300 bg-purple-50" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">
                {cursos.reduce((total, curso) => total + (curso.likes ? curso.likes.length : 0), 0)}
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleFilterCursos("conInscripciones")}
          className={`bg-white rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer ${
            activeFilter === "conInscripciones" ? "ring-2 ring-green-300 bg-green-50" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Inscripciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {cursos.reduce((total, curso) => total + (curso.inscritos ? curso.inscritos.length : 0), 0)}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Indicador de filtro activo */}
      {activeFilter !== "todos" && (
        <div className="mb-6 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filtro activo: 
              {activeFilter === "conLikes" && " Cursos con likes"}
              {activeFilter === "conInscripciones" && " Cursos con inscripciones"}
            </span>
            <span className="text-xs text-gray-500">
              ({filteredCursos.length} cursos encontrados)
            </span>
          </div>
          <button
            onClick={() => handleFilterCursos("todos")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Quitar filtro
          </button>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de cursos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando cursos...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cupos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscripciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCurso.map((curso) => (
                <tr key={curso._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                        src={curso.imagen || "https://via.placeholder.com/40x40?text=Curso"}
                        alt={curso.nombre}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{curso.nombre}</div>
                        <div className="text-sm text-gray-500">{curso.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {curso.instructorId?.nombre || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {curso.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${curso.valor?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openLikesModal(curso)}
                      className="flex items-center gap-2 text-sm text-gray-900 hover:text-purple-600"
                    >
                      <span className="text-purple-600">⭐</span>
                      <span className="font-medium">{curso.likes ? curso.likes.length : 0}</span>
                      {curso.likes && curso.likes.length > 0 && (
                        <span className="text-xs text-gray-500">Ver detalles</span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {curso.inscritos ? curso.inscritos.length : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(curso)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarCurso(curso._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === page
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}

      {/* Modal de edición */}
      {showModal && (
        <AdminEditCursoModal
          curso={selectedCurso}
          onClose={() => setShowModal(false)}
          onSave={handleSaveChanges}
        />
      )}

      {/* Modal de likes */}
      {showLikesModal && selectedCursoLikes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Detalles de Likes - {selectedCursoLikes.nombre}
              </h2>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-lg">
                <span className="text-purple-600">⭐</span>
                <span className="font-semibold">
                  Total de Likes: {selectedCursoLikes.likes ? selectedCursoLikes.likes.length : 0}
                </span>
              </div>
            </div>

            {selectedCursoLikes.likes && selectedCursoLikes.likes.length > 0 ? (
              <div className="space-y-3">
                {selectedCursoLikes.likes.map((like, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {like.nombreUsuario || "Usuario"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {like.emailUsuario || "Email no disponible"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fecha: {new Date(like.fechaLike).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-purple-600 text-2xl">⭐</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-6xl text-gray-300">⭐</span>
                <p className="text-gray-500 text-lg mt-2">Este curso aún no tiene likes</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLikesModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoList;
