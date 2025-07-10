import { Navigate } from "react-router-dom";

const InstructorRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.rol !== "instructor") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default InstructorRoute;
