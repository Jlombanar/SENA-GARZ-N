import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminUserTable from "../../components/AdminUserTable";
import AdminEditUserModal from "../../components/AdminEditUserModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsuarios((prev) => prev.filter((u) => u._id !== id));
        toast.success("Usuario eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        toast.error("Error al eliminar usuario");
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        selectedUser
      );

      const updatedUser = res.data.user;
      setUsuarios((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );

      setShowModal(false);
      setSelectedUser(null);
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("Error al actualizar usuario");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsers = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-gray-500">Cargando usuarios...</p>
      </div>
    );

  return (
    <div className="w-full px-4">
      <AdminUserTable
        usuarios={paginatedUsers}
        onEdit={openEditModal}
        onDelete={eliminarUsuario}
        searchTerm={search}
        setSearchTerm={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal && selectedUser && (
        <AdminEditUserModal
          selectedUser={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onChange={setSelectedUser}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default UserList;
