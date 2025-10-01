import { Navigate } from "react-router-dom";
import { getStoredUser, isSessionExpired, clearAuthSession } from "../utils/storage";

const InstructorRoute = ({ children }) => {
  const user = getStoredUser();

  if (!user || user.rol !== "instructor") {
    return <Navigate to="/login" />;
  }

  if (isSessionExpired()) {
    clearAuthSession(true);
    return <Navigate to="/login" />;
  }

  return children;
};

export default InstructorRoute;
