// src/components/UserLayout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const UserLayout = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar user={user} onLogout={onLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
