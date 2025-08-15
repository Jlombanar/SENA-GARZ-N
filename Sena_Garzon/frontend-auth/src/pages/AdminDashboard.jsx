import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminWelcome from "../components/AdminWelcome";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "admin") {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <AdminWelcome />
  );
};

export default AdminDashboard;