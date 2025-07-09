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

  useEffect(() => {
    fetchCurso();
  }, []);

  const filteredCursos = cursos.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
  const paginatedCurso = filteredCursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-gray-500">Cargando cursos...</p>
      </div>
    );

  return (
    <div className="w-full px-4">
      <AdminCursoTable
        cursos={paginatedCurso}
        onEdit={openEditModal}
        onDelete={eliminarCurso}
        searchTerm={search}
        setSearchTerm={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal && selectedCurso && (
        <AdminEditCursoModal
          curso={selectedCurso}
          onClose={() => {
            setShowModal(false);
            setSelectedCurso(null);
          }}
          onChange={setSelectedCurso}
          onSave={handleSaveChanges}
          isEditing
        />
      )}
    </div>
  );
};

export default CursoList;
