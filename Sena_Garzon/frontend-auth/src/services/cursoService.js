import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/cursos`;

// --- NUEVAS FUNCIONES PÚBLICAS ---

/**
 * Obtiene todos los cursos para mostrarlos públicamente (ej. en la página de bienvenida).
 * No requiere token de autenticación.
 */
export const getPublicCursos = () => {
  return axios.get(API_URL);
};

/**
 * Obtiene un curso específico por su ID para mostrar su página de detalles.
 * No requiere token de autenticación.
 */
export const getCursoById = (cursoId) => {
  return axios.get(`${API_URL}/${cursoId}`);
};


// --- TUS FUNCIONES EXISTENTES (SIN CAMBIOS) ---

export const getCursos = (token) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCursosInstructor = (token) =>
  axios.get(`${API_URL}/instructor`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createCurso = (curso, token) =>
  axios.post(API_URL, curso, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCurso = (id, curso, token) =>
  axios.put(`${API_URL}/${id}`, curso, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCurso = (id, token) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Función para inscribirse en un curso
export const inscribirseCurso = (cursoId, formData, token) => {
  return axios.post(`${API_URL}/${cursoId}/inscribirse`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Función para obtener inscripciones de un curso (instructores)
export const getInscripcionesCurso = (cursoId, token) => {
  return axios.get(`${API_URL}/${cursoId}/inscripciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Función para revisar una inscripción (instructores)
export const revisarInscripcion = (cursoId, inscripcionId, datos, token) => {
  return axios.put(`${API_URL}/${cursoId}/inscripciones/${inscripcionId}/revisar`, datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Función para eliminar una inscripción
export const eliminarInscripcion = (cursoId, inscripcionId, token) => {
  return axios.delete(`${API_URL}/${cursoId}/inscripciones/${inscripcionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Sistema de likes
export const toggleLike = async (cursoId, token) => {
  const response = await axios.post(
    `${API_URL}/${cursoId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getCursosPorLikes = async (token) => {
  const response = await axios.get(`${API_URL}/top-likes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};