import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TopCursos from "./pages/TopCursos";
import NotFound from "./pages/NotFound";

// Componentes de ruta y layout
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import InstructorRoute from "./components/InstructorRoute";
import AdminLayout from "./components/AdminLayout";
import InstructorLayout from "./components/InstructorLayout";
import UserLayout from "./components/UserLayout";

// Páginas del dashboard
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

// Páginas de admin
import UserList from "./pages/admin/UserList";
import Curso from "./pages/admin/Curso";
import InstructorList from "./pages/admin/InstructorList";
// Reportes integrado al dashboard

// Páginas de instructor
import InstructorCursos from "./pages/instructor/InstructorCursos";
import InstructorPerfil from "./pages/instructor/InstructorPerfil";
import InstructorInscripciones from "./pages/instructor/InstructorInscripciones";
import InstructorCalendario from "./pages/instructor/InstructorCalendario";
import InstructorEvaluaciones from "./pages/instructor/InstructorEvaluaciones";

// Páginas de usuario
import Miscurso from "./pages/user/Miscurso";
import UserProfile from "./pages/user/UserProfile";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/top-cursos" element={<TopCursos />} />
          
          {/* Rutas privadas con UserLayout */}
          <Route path="/dashboard" element={<PrivateRoute><UserLayout><Dashboard /></UserLayout></PrivateRoute>} />
          <Route path="/dashboard/miscurso" element={<PrivateRoute><UserLayout><Miscurso /></UserLayout></PrivateRoute>} />
          <Route path="/dashboard/profile" element={<PrivateRoute><UserLayout><UserProfile /></UserLayout></PrivateRoute>} />
          
          {/* Rutas de admin con AdminLayout */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserList /></AdminLayout></AdminRoute>} />
          <Route path="/admin/cursos" element={<AdminRoute><AdminLayout><Curso /></AdminLayout></AdminRoute>} />
          <Route path="/admin/instructores" element={<AdminRoute><AdminLayout><InstructorList /></AdminLayout></AdminRoute>} />
          <Route path="/admin/reportes" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          
          {/* Rutas de instructor con InstructorLayout */}
          <Route path="/instructor" element={<InstructorRoute><InstructorLayout><InstructorDashboard /></InstructorLayout></InstructorRoute>} />
          <Route path="/instructor/cursos" element={<InstructorRoute><InstructorLayout><InstructorCursos /></InstructorLayout></InstructorRoute>} />
          <Route path="/instructor/inscripciones" element={<InstructorRoute><InstructorLayout><InstructorInscripciones /></InstructorLayout></InstructorRoute>} />
          <Route path="/instructor/calendario" element={<InstructorRoute><InstructorLayout><InstructorCalendario /></InstructorLayout></InstructorRoute>} />
          <Route path="/instructor/evaluaciones" element={<InstructorRoute><InstructorLayout><InstructorEvaluaciones /></InstructorLayout></InstructorRoute>} />
          <Route path="/instructor/perfil" element={<InstructorRoute><InstructorLayout><InstructorPerfil /></InstructorLayout></InstructorRoute>} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
