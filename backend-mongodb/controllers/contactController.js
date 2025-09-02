import { sendEmail } from "../utils/sendEmail.js";

export const contact = async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body || {};
    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!adminEmail) {
      return res.status(500).json({ message: "No hay correo de administrador configurado" });
    }

    const subjectAdmin = `Nuevo mensaje de contacto - ${nombre}`;
    const htmlAdmin = `
      <h2>Nuevo mensaje desde Contáctanos</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje.replace(/\n/g, '<br/>')}</p>
    `;
    await sendEmail(adminEmail, subjectAdmin, htmlAdmin);

    // Respuesta al usuario (opcional)
    const subjectUser = `Hemos recibido tu mensaje - SENA Garzón`;
    const htmlUser = `
      <h2>Gracias por contactarnos</h2>
      <p>Hola ${nombre},</p>
      <p>Hemos recibido tu mensaje y nuestro equipo te responderá pronto.</p>
      <hr/>
      <p><em>Tu mensaje:</em></p>
      <p>${mensaje.replace(/\n/g, '<br/>')}</p>
    `;
    await sendEmail(correo, subjectUser, htmlUser);

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("❌ Error en contacto:", error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};


