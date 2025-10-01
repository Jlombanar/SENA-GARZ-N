import React, { useEffect, useState } from "react";
import axios from "axios";
// Importaciones de iconos para un diseño más profesional
import { FaBook, FaHeart, FaUserFriends, FaSearch, FaSyncAlt, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import AdminEditCursoModal from "../../components/AdminEditCursoModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CursoList = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedCursoLikes, setSelectedCursoLikes] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos");
  const itemsPerPage = 5;

  const fetchCursos = async () => {
    try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/cursos`);
      setCursos(res.data);
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
      confirmButtonColor: "#EF4444", // Rojo de Tailwind
      cancelButtonColor: "#6B7280", // Gris de Tailwind
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        confirmButton: 'px-4 py-2 font-semibold',
        cancelButton: 'px-4 py-2 font-semibold'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/cursos/${id}`);
        setCursos((prev) => prev.filter((c) => c._id !== id));
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
      setCursos((prev) =>
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

  const handleFilterCursos = (filterType) => {
    setActiveFilter(filterType);
    setCurrentPage(1);
  };

  const getFilteredCursos = () => {
    let filtered = cursos;
    
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
    
    if (search) {
      filtered = filtered.filter((c) =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const filteredCursos = getFilteredCursos();
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
  const paginatedCursos = filteredCursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans antialiased">
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Gestión de Cursos</h1>
        <button
          onClick={fetchCursos}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <FaSyncAlt className="animate-spin-slow" />
          Actualizar
        </button>
      </div>

      {/* Tarjetas de estadísticas con efecto de sombra */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => handleFilterCursos("todos")}
          className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
            activeFilter === "todos" ? "ring-2 ring-gray-400 border-gray-600" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-200 text-gray-600">
              <FaBook className="text-2xl" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-sm font-medium text-gray-500">Total Cursos</p>
              <p className="text-3xl font-bold text-gray-900">{cursos.length}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleFilterCursos("conLikes")}
          className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
            activeFilter === "conLikes" ? "ring-2 ring-red-400 border-red-600" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-200 text-red-600">
              <FaHeart className="text-2xl" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-sm font-medium text-gray-500">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900">
                {cursos.reduce((total, curso) => total + (curso.likes ? curso.likes.length : 0), 0)}
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleFilterCursos("conInscripciones")}
          className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
            activeFilter === "conInscripciones" ? "ring-2 ring-green-400 border-green-600" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-200 text-green-600">
              <FaUserFriends className="text-2xl" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-sm font-medium text-gray-500">Total Inscripciones</p>
              <p className="text-3xl font-bold text-gray-900">
                {cursos.reduce((total, curso) => total + (curso.inscritos ? curso.inscritos.length : 0), 0)}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Contenedor principal de la tabla */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        
        {/* Barra de búsqueda con icono */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cursos por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
          />
        </div>

        {/* Indicador de filtro activo */}
        {activeFilter !== "todos" && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center justify-between border-l-4 border-blue-400">
            <div className="flex items-center gap-2 text-blue-800">
              <span className="text-sm font-semibold">
                Filtro activo: 
                {activeFilter === "conLikes" && " Cursos con likes"}
                {activeFilter === "conInscripciones" && " Cursos con inscripciones"}
              </span>
              <span className="text-xs text-blue-600">
                ({filteredCursos.length} cursos encontrados)
              </span>
            </div>
            <button
              onClick={() => handleFilterCursos("todos")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <FaTimes className="text-xs" />
              Quitar filtro
            </button>
          </div>
        )}

        {/* Tabla de cursos */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin-fast rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando cursos...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {paginatedCursos.length > 0 ? (
                  paginatedCursos.map((curso) => (
                    <tr key={curso._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-xl object-cover mr-4 shadow-sm"
                            src={curso.imagen || "https://via.placeholder.com/48x48?text=Curso"}
                            alt={curso.nombre}
                          />
                          <div>
                            <div className="text-sm font-bold text-gray-900">{curso.nombre}</div>
                            <div className="text-xs text-gray-500">{curso.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {curso.instructorId?.nombre || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {curso.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${curso.valor?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openLikesModal(curso)}
                          className="flex items-center gap-2 text-sm text-gray-900 hover:text-red-600 transition-colors duration-200"
                        >
                          <FaHeart className="text-red-400" />
                          <span className="font-semibold">{curso.likes ? curso.likes.length : 0}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {curso.inscritos ? curso.inscritos.length : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-4">
                          <button
                            onClick={() => openEditModal(curso)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Editar"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => eliminarCurso(curso._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Eliminar"
                          >
                            <FaTrashAlt className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 text-lg">
                      No se encontraron cursos que coincidan con los filtros. 😢
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {showModal && selectedCurso && (
        <AdminEditCursoModal
          curso={selectedCurso}
          onClose={() => setShowModal(false)}
          onSave={handleSaveChanges}
        />
      )}

      {/* Modal de likes */}
      {showLikesModal && selectedCursoLikes && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Likes en "{selectedCursoLikes.nombre}"
              </h2>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
                <FaHeart className="text-red-500 text-2xl" />
                <span>
                  Total de Likes: {selectedCursoLikes.likes ? selectedCursoLikes.likes.length : 0}
                </span>
              </div>
            </div>

            {selectedCursoLikes.likes && selectedCursoLikes.likes.length > 0 ? (
              <div className="space-y-4">
                {selectedCursoLikes.likes.map((like, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-white transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {like.nombreUsuario || "Usuario Anónimo"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {like.emailUsuario || "Correo no disponible"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha: {new Date(like.fechaLike).toLocaleDateString()}
                        </p>
                      </div>
                      <FaHeart className="text-red-500 text-3xl opacity-80" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaHeart className="text-gray-300 text-6xl mb-4" />
                <p className="text-gray-500 text-lg mt-2">Este curso aún no tiene likes.</p>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowLikesModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
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