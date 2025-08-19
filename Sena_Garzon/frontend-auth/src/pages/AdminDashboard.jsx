import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminWelcome from "../components/AdminWelcome";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const storedUser = raw ? JSON.parse(raw) : null;
      if (!storedUser || storedUser.rol !== "admin") {
        navigate("/login");
      } else {
        setUser(storedUser);
      }
    } catch (_) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <AdminWelcome />
  );
};

export default AdminDashboard;