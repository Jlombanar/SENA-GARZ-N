import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/storage";

const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" />;
  if (user.rol === "admin" || user.isAdmin) return children;
  return <Navigate to="/dashboard" />;
};

export default AdminRoute;
