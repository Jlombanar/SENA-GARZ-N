const Welcome = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Bienvenido al Panel de Administración</h1>
      <p className="text-gray-700 mb-2">
        Hola <strong>{user?.nombre}</strong>, estás ingresando como <span className="italic text-gray-800">{user?.rol}</span>.
      </p>

      {/* Mensajes personalizados según el rol del usuario */}
      { user?.rol === "admin" && (
        <p className="text-gray-700 mb-4">
          Tienes acceso completo a todas las funcionalidades del panel.
        </p>
      )}
      { user?.rol === "user" && (
        <p className="text-gray-700 mb-4">
          Puedes gestionar tu perfil y ver tus pedidos.
        </p>
      )}
    </div>
  );
};

export default Welcome;