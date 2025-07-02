const Welcome = ({ user }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-4xl mx-auto border border-green-100">
      <h1 className="text-3xl font-extrabold text-green-700 mb-4">
        ¡Bienvenido al Panel de SENA Garzón!
      </h1>
      <p className="text-gray-700 text-lg mb-3">
        Hola <span className="font-semibold text-gray-900">{user?.nombre}</span>, has ingresado como{' '}
        <span className="italic text-green-700">{user?.rol}</span>.
      </p>

      {user?.rol === "admin" && (
        <div className="text-gray-600 text-sm bg-green-50 p-4 rounded-lg border border-green-200">
          Tienes acceso completo para administrar usuarios, cursos y recursos del sistema.
        </div>
      )}

      {user?.rol === "instructor" && (
        <div className="text-gray-600 text-sm bg-green-50 p-4 rounded-lg border border-green-200">
          Puedes crear y gestionar tus cursos complementarios, subir materiales y consultar inscritos.
        </div>
      )}

      {user?.rol === "aprendiz" && (
        <div className="text-gray-600 text-sm bg-green-50 p-4 rounded-lg border border-green-200">
          Accede a los cursos disponibles, consulta tus horarios y descarga tus certificados.
        </div>
      )}
    </div>
  );
};

export default Welcome;