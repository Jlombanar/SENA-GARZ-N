import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '../components/Welcome';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const storedUser = raw ? JSON.parse(raw) : null;
      if (!storedUser) {
        navigate("/login");
      } else {
        setUser(storedUser);
      }
    } catch (_) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return <Welcome user={user} />;
};

export default Dashboard;
