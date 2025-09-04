import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/storage";

const PrivateRoute = ({ children }) => {
  const user = getStoredUser();
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
