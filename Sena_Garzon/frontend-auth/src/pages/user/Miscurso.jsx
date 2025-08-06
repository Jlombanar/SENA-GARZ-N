import React, { useEffect, useState } from "react";
import { getCursos, inscribirseCurso } from "../../services/cursoService";
import { toast } from "react-toastify";

const Miscurso = () => {
const [cursos, setCursos] = useState([]);
const [inscripciones, setInscripciones] = useState({});
const token = localStorage.getItem("token");

useEffect(() => {
const fetchCursos = async () => {
try {
const res = await getCursos(token);
setCursos(res.data);
} catch (err) {
console.error("Error al cargar cursos", err);
}
};


fetchCursos();
}, []);

const handleChange = (cursoId, field, value) => {
setInscripciones((prev) => ({
...prev,
[cursoId]: {
...prev[cursoId],
[field]: value,
},
}));
};

const handleFileChange = (cursoId, file) => {
setInscripciones((prev) => ({
...prev,
[cursoId]: {
...prev[cursoId],
file,
},
}));
};

const handleInscribirse = async (cursoId) => {
const datos = inscripciones[cursoId];
if (!datos || !datos.numeroTarjeta || !datos.file) {
toast.error("Completa todos los campos para inscribirte.");
return;
}


const formData = new FormData();
formData.append("numeroTarjeta", datos.numeroTarjeta);
formData.append("tarjetaPDF", datos.file); // backend espera 'tarjetaPDF'

try {
  await inscribirseCurso(cursoId, formData, token);
  toast.success("Te inscribiste correctamente.");
  setInscripciones((prev) => ({
    ...prev,
    [cursoId]: { numeroTarjeta: "", file: null },
  }));
} catch (err) {
  toast.error("Error al inscribirse.");
  console.error(err);
}
};

return (
<div className="p-6 max-w-6xl mx-auto">
<h1 className="text-3xl font-bold text-green-700 mb-4">Mis Cursos</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{cursos.map((curso) => (
<div key={curso._id} className="bg-white p-4 rounded shadow">
<img src={curso.imagen} alt={curso.nombre} className="w-full h-40 object-cover rounded mb-2" />
<h2 className="text-xl font-bold text-green-800">{curso.nombre}</h2>
<p className="text-gray-600">{curso.descripcion}</p>
<div className="mt-4 space-y-2">
<input
type="text"
placeholder="Número de tarjeta"
value={inscripciones[curso._id]?.numeroTarjeta || ""}
onChange={(e) => handleChange(curso._id, "numeroTarjeta", e.target.value)}
className="w-full border p-2 rounded"
/>
<input
type="file"
accept="application/pdf"
onChange={(e) => handleFileChange(curso._id, e.target.files[0])}
className="w-full border p-2 rounded"
/>
<button
onClick={() => handleInscribirse(curso._id)}
className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-full"
>
Inscribirse
</button>
</div>
</div>
))}
</div>
</div>
);
};

export default Miscurso;