import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (user.rol === "admin" || user.isAdmin) return children;
  return <Navigate to="/dashboard" />;
};

export default AdminRoute;
