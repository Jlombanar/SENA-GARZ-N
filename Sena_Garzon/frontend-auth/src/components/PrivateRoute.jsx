import { Navigate } from "react-router-dom";
import { getStoredUser, isSessionExpired, clearAuthSession } from "../utils/storage";

const PrivateRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" />;
  if (isSessionExpired()) {
    clearAuthSession(true);
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
