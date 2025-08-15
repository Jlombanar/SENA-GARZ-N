# 📋 Instrucciones de Instalación - SENA Garzón

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Sena_Garzon
```

### 2. Instalar todas las dependencias
```bash
npm run install-all
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la carpeta `backend-mongodb/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sena_garzon
JWT_SECRET=tu_clave_secreta_muy_segura
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### 4. Iniciar MongoDB
```bash
# En Windows (si tienes MongoDB instalado)
mongod

# En macOS/Linux
sudo systemctl start mongod
```

### 5. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🔧 Instalación Manual (Paso a Paso)

### Backend
```bash
cd backend-mongodb
npm install
npm run dev
```

### Frontend
```bash
cd frontend-auth
npm install
npm run dev
```

---

## 📋 Prerrequisitos

### Software Requerido
- **Node.js**: Versión 14 o superior
- **MongoDB**: Versión 4.4 o superior
- **npm**: Viene con Node.js

### Verificar Instalaciones
```bash
node --version
npm --version
mongod --version
```

---

## 🗄️ Configuración de Base de Datos

### MongoDB Local
1. Instalar MongoDB desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Crear base de datos:
```bash
mongosh
use sena_garzon
```

### MongoDB Atlas (Nube)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear cluster gratuito
3. Obtener string de conexión
4. Reemplazar en `.env`:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sena_garzon
```

---

## 📧 Configuración de Email

### Gmail
1. Activar verificación en dos pasos
2. Generar clave de aplicación:
   - Ir a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Seleccionar "Correo" y "Otro"
   - Copiar la clave de 16 caracteres
3. Usar en `.env`:
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=clave_de_aplicacion_16_caracteres
```

---

## 🧪 Probar el Sistema

### 1. Crear usuario administrador
```bash
cd backend-mongodb
node -e "
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');

async function crearAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      nombre: 'Administrador',
      email: 'admin@sena.edu.co',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Administrador creado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

crearAdmin();
"
```

### 2. Probar sistema de likes
```bash
cd backend-mongodb
node test/test-likes.js
```

---

## 🚨 Solución de Problemas

### Error: "MongoDB connection failed"
- Verificar que MongoDB esté ejecutándose
- Verificar la URI en `.env`
- Verificar permisos de red

### Error: "JWT_SECRET is required"
- Verificar que el archivo `.env` esté en la carpeta correcta
- Verificar que JWT_SECRET tenga un valor

### Error: "Email configuration failed"
- Verificar credenciales de Gmail
- Verificar que la verificación en dos pasos esté activada
- Verificar la clave de aplicación

### Error: "Port already in use"
- Cambiar el puerto en `.env`
- O terminar procesos que usen el puerto:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

---

## 📱 Acceso a la Aplicación

### Usuarios de Prueba
- **Admin**: admin@sena.edu.co / admin123
- **Instructor**: instructor@sena.edu.co / instructor123
- **Usuario**: usuario@sena.edu.co / usuario123

### Funcionalidades por Rol

#### 👤 Usuario Regular
- Ver cursos disponibles
- Dar likes a cursos
- Inscribirse a cursos
- Ver estado de inscripciones

#### 👨‍🏫 Instructor
- Crear y gestionar cursos
- Ver inscripciones de aprendices
- Aprobar/rechazar solicitudes
- Agregar observaciones

#### 👑 Administrador
- Gestionar todos los usuarios
- Ver estadísticas del sistema
- Gestionar roles y permisos

---

## 🔄 Actualizaciones

### Actualizar dependencias
```bash
npm run install-all
```

### Actualizar desde Git
```bash
git pull origin main
npm run install-all
```

---

## 📞 Soporte

Si encuentras problemas:
1. Verificar que todos los prerrequisitos estén instalados
2. Verificar la configuración en `.env`
3. Revisar los logs del servidor
4. Crear un issue en el repositorio

---

**¡El sistema SENA Garzón está listo para usar! 🎉**



