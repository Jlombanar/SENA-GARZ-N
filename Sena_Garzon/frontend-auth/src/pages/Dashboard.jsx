import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '../components/Welcome'; // ✅ Mantén esto si lo necesitas

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.nombre}</h1>
      <Welcome user={user} />
    </div>
  );
};

export default Dashboard;
