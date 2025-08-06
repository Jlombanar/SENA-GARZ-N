import axios from "axios";

const API_URL = "http://localhost:5000/api/curso"; // ajusta si tu backend es diferente

export const getCursos = (token) =>
  axios.get(API_URL, {
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

// ✅ ESTA ES LA CORRECTA
export const inscribirseCurso = (cursoId, formData, token) =>
  axios.post(`${API_URL}/${cursoId}/inscribirse`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
