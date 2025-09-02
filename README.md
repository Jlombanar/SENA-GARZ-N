
# SENA Garzón - Sistema de Gestión de Cursos

## 🚀 Funcionalidades Implementadas

### 👥 Sistema de Usuarios
- **Registro e Inicio de Sesión**: Sistema completo de autenticación
- **Roles de Usuario**: 
  - Usuario regular (aprendiz)
  - Instructor
  - Administrador
- **Gestión de Perfiles**: Los usuarios pueden ver y editar su información

### 📚 Gestión de Cursos
- **Creación de Cursos**: Los instructores pueden crear cursos con información completa
- **Categorización**: Los cursos se organizan por categorías (tecnología, gastronomía, construcción, idiomas, moda)
- **Imágenes**: Soporte para imágenes de cursos
- **Cupos y Valores**: Control de disponibilidad y precios

### ❤️ Sistema de Likes Mejorado
- **Registro Completo**: Cada like se registra con información del usuario
- **Estadísticas en Tiempo Real**: Conteo preciso de likes por curso
- **Ranking de Popularidad**: Los cursos se ordenan por cantidad de likes
- **Persistencia en Base de Datos**: Todos los likes se almacenan permanentemente
- **Información del Usuario**: Se guarda nombre y email del usuario que dio like

### 📊 Estadísticas y Reportes
- **Dashboard de Instructor**: Vista completa de inscripciones y estadísticas
- **Estadísticas de Likes**: 
  - Total de likes por curso
  - Promedio de likes
  - Curso más popular
  - Ranking completo
- **Estadísticas de Inscripciones**:
  - Total de inscripciones
  - Pendientes, aprobadas y rechazadas
  - Filtros por estado

### 🎯 Sistema de Inscripciones
- **Inscripción Completa**: Los usuarios pueden inscribirse a cursos
- **Documentos PDF**: Subida de tarjetas de inscripción
- **Estados de Inscripción**: 
  - Pendiente (por defecto)
  - Aprobada
  - Rechazada
- **Gestión del Instructor**: Los instructores pueden aprobar/rechazar inscripciones
- **Observaciones**: Los instructores pueden agregar comentarios

### 🏠 Página de Inicio Mejorada
- **Redirección Inteligente**: 
  - Usuarios no registrados → Registro
  - Usuarios registrados → Mis Cursos
- **Ranking Visual**: Los cursos se muestran ordenados por popularidad
- **Badges de Popularidad**: Indicadores visuales del ranking
- **Conteo Real de Likes**: Muestra el número exacto de likes

### 👨‍🏫 Panel del Instructor
- **Gestión de Cursos**: Crear, editar y eliminar cursos
- **Vista de Inscripciones**: Lista completa de aspirantes
- **Aprobación/Rechazo**: Control total sobre las inscripciones
- **Filtros por Estado**: Organizar inscripciones por estado
- **Observaciones**: Agregar comentarios a cada solicitud
- **Descarga de PDFs**: Acceso a documentos de inscripción

### 📱 Página de Mis Cursos
- **Estado de Inscripciones**: Los usuarios ven el estado de sus solicitudes
- **Reenvío de Solicitudes**: Posibilidad de reenviar si fueron rechazadas
- **Información Detallada**: Precios, cupos, likes y categorías
- **Formularios Dinámicos**: Campos que se adaptan según el estado

### 🏆 Top Cursos
- **Ranking por Popularidad**: Los cursos más populares primero
- **Estadísticas Detalladas**: Métricas completas del sistema
- **Visualización Mejorada**: Badges de ranking y estadísticas
- **Información en Tiempo Real**: Datos actualizados constantemente

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **Express.js**
- **MongoDB** con **Mongoose**
- **JWT** para autenticación
- **Multer** para manejo de archivos
- **Nodemailer** para envío de emails

### Frontend
- **React.js** con **Vite**
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **React Icons** para iconografía

## 📁 Estructura del Proyecto

```
Sena_Garzon/
├── backend-mongodb/          # API del servidor
│   ├── controllers/          # Lógica de negocio
│   ├── models/              # Modelos de datos
│   ├── routes/              # Rutas de la API
│   ├── middleware/          # Middlewares de autenticación
│   └── utils/               # Utilidades (envío de emails)
├── frontend-auth/           # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios para API
│   │   └── assets/          # Recursos estáticos
└── img/                     # Imágenes del proyecto
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

### Backend
```bash
cd backend-mongodb
npm install
npm start
```

### Frontend
```bash
cd frontend-auth
npm install
npm run dev
```

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en el backend:
```env
MONGODB_URI=mongodb://localhost:27017/sena_garzon
JWT_SECRET=tu_secreto_jwt
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_email
```

### Base de Datos
El sistema creará automáticamente las colecciones necesarias en MongoDB.

## 📊 API Endpoints

### Cursos
- `GET /api/cursos` - Obtener todos los cursos
- `GET /api/cursos/top-likes` - Cursos ordenados por likes
- `GET /api/cursos/estadisticas-likes` - Estadísticas de likes
- `POST /api/cursos/:id/like` - Dar/quitar like a un curso
- `POST /api/cursos/:id/inscribirse` - Inscribirse a un curso

### Inscripciones (Instructores)
- `GET /api/cursos/:id/inscripciones` - Ver inscripciones de un curso
- `PUT /api/cursos/:cursoId/inscripciones/:inscripcionId/revisar` - Aprobar/rechazar inscripción
- `DELETE /api/cursos/:cursoId/inscripciones/:inscripcionId` - Eliminar inscripción

## 🧪 Pruebas

Para probar el sistema de likes:
```bash
cd backend-mongodb
node test/test-likes.js
```

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Middleware de Autorización**: Control de acceso por roles
- **Validación de Datos**: Verificación de entrada de datos
- **Sanitización**: Prevención de inyección de código

## 📈 Características Destacadas

### Sistema de Likes Inteligente
- **Persistencia Completa**: Cada like se registra con metadatos
- **Estadísticas en Tiempo Real**: Conteo preciso y actualizado
- **Ranking Automático**: Los cursos se ordenan por popularidad
- **Información del Usuario**: Se guarda contexto completo de cada like

### Gestión de Inscripciones
- **Flujo Completo**: Desde solicitud hasta aprobación
- **Estados Múltiples**: Control granular del proceso
- **Observaciones**: Comunicación entre instructor y aprendiz
- **Documentos**: Manejo seguro de archivos PDF

### Dashboard Intuitivo
- **Vista de Instructor**: Control total sobre cursos e inscripciones
- **Filtros Avanzados**: Organización por múltiples criterios
- **Estadísticas Visuales**: Métricas claras y comprensibles
- **Acciones Rápidas**: Botones para tareas comunes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo del SENA Garzón.

---

**SENA Garzón** - Transformando vidas a través de la educación técnica de calidad.
