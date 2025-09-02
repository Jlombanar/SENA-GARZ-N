# 🌐 Frontend - React + Vite

Este es el frontend del proyecto, desarrollado con **React + Vite + TailwindCSS**. 

## 🚀 Funcionalidades

- Autenticación de usuarios (login y registro).
- Redirección condicional por rol (`admin` o `user`).
- Dashboard para usuarios registrados.
- Panel de administración con:
  - Tabla de usuarios.
  - Edición de usuarios desde un modal.
  - Eliminación de usuarios.

## 📦 Instalación

```bash
cd frontend
npm install
```

## 🧪 Ejecución en desarrollo

```bash
npm run dev
```

Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

## 🔐 Variables de entorno

Este frontend no requiere variables `.env` por defecto, pero puedes usar:

```env
VITE_API_URL=http://localhost:5000/api
```

Para luego consumirla como `import.meta.env.VITE_API_URL`.

## 📁 Estructura base

```
src/
├── pages/
├── components/
└── App.jsx
```

## 📝 Notas

- Conecta al backend por defecto en `http://localhost:5000/api`.
- Usa `axios` para las peticiones HTTP.
