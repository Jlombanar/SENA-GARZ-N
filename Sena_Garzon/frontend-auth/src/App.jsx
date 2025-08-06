import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Vistas públicas y comunes
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Rutas protegidas
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import InstructorRoute from "./components/InstructorRoute";

// Panel Administrador
import AdminLayout from "./components/AdminLayout";
import Usuarios from "./pages/admin/UserList";
import Curso from "./pages/admin/Curso";
import InstructorList from "./pages/admin/InstructorList";
import Reportes from "./pages/admin/Reportes";
import AdminWelcome from "./components/Welcome";

// Panel Instructor
import InstructorLayout from "./components/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCursos from "./pages/instructor/InstructorCursos";
import InstructorPerfil from "./pages/instructor/InstructorPerfil"; // 👈 IMPORTACIÓN AÑADIDA

// Panel Usuario
import UserLayout from "./components/UserLayout";
import Dashboard from "./pages/Dashboard";
import Miscurso from "./pages/user/Miscurso";
import UserProfile from "./pages/user/UserProfile";



const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Panel del usuario */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserLayout user={user} onLogout={onLogout} />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="miscurso" element={<Miscurso />} />
          <Route path="perfil" element={<UserProfile />} />
        </Route>

        {/* Panel del administrador */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout user={user} onLogout={onLogout} />
            </AdminRoute>
          }
        >
          <Route index element={<AdminWelcome user={user} />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="curso" element={<Curso />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="instructores" element={<InstructorList />} />
        </Route>

        {/* Panel del instructor */}
        <Route
          path="/instructor"
          element={
            <InstructorRoute>
              <InstructorLayout user={user} onLogout={onLogout} />
            </InstructorRoute>
          }
        >
          <Route index element={<InstructorDashboard />} />
          <Route path="cursos" element={<InstructorCursos />} />
          <Route path="perfil" element={<InstructorPerfil />} /> {/* 👈 NUEVA RUTA */}
        </Route>

        {/* Ruta no válida */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toastify container global */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
