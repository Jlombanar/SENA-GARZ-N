import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminProductsTable from "../../components/AdminProductsTable";
import AdminEditProductsModal from "../../components/AdminEditProductsModal";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 5;

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      toast.error("Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/productos/${id}`);
        setProductos((prev) => prev.filter((p) => p._id !== id));
        toast.success("Producto eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        toast.error("Error al eliminar producto");
      }
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setSelectedProduct({ nombre: "", cantidad: "", valor: "", imagen: null });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
  try {
    const formData = new FormData();
    formData.append("nombre", selectedProduct.nombre);
    formData.append("cantidad", selectedProduct.cantidad);
    formData.append("valor", selectedProduct.valor);
    if (selectedProduct.imagen instanceof File) {
      formData.append("imagen", selectedProduct.imagen);
    }

    const res = await axios.put(
      `http://localhost:5000/api/productos/${selectedProduct._id}`,
      formData
    );

    const updated = res.data.producto; // ✅ importante
    setProductos((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );

    toast.success("Producto actualizado correctamente");
    setShowModal(false);
    setSelectedProduct(null);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    toast.error("Error al actualizar producto");
  }
};

const handleCreateProduct = async () => {
  try {
    const formData = new FormData();
    formData.append("nombre", selectedProduct.nombre);
    formData.append("cantidad", selectedProduct.cantidad);
    formData.append("valor", selectedProduct.valor);
    if (selectedProduct.imagen instanceof File) {
      formData.append("imagen", selectedProduct.imagen);
    }

    const res = await axios.post("http://localhost:5000/api/productos", formData);
    setProductos((prev) => [...prev, res.data.producto]); // o [res.data.producto, ...prev]
    toast.success("Producto creado exitosamente");
    setShowModal(false);
    setSelectedProduct(null);
  } catch (error) {
    console.error("Error al crear producto:", error);
    toast.error("Error al crear producto");
  }
};


  useEffect(() => {
    fetchProductos();
  }, []);

  const filteredProducts = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    );

  return (
    <div className="w-full px-4">
      <AdminProductsTable
        productos={paginatedProducts}
        onEdit={openEditModal}
        onDelete={eliminarProducto}
        onCreate={openCreateModal}
        searchTerm={search}
        setSearchTerm={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal && selectedProduct && (
        <AdminEditProductsModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onChange={setSelectedProduct}
          onSave={handleSaveChanges}
          onCreate={handleCreateProduct}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Productos;
