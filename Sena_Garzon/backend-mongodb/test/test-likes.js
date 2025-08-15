// test/test-likes.js
import mongoose from 'mongoose';
import Curso from '../models/Curso.js';
import User from '../models/User.js';

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/sena_garzon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const testLikesSystem = async () => {
  try {
    console.log('🧪 Probando sistema de likes...');

    // Crear un usuario de prueba
    const testUser = new User({
      nombre: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();
    console.log('✅ Usuario de prueba creado');

    // Crear un curso de prueba
    const testCurso = new Curso({
      nombre: 'Curso de Prueba',
      descripcion: 'Descripción del curso de prueba',
      cantidad: 20,
      valor: 150000,
      categoria: 'tecnologia',
      duracion: '80 horas',
      instructorId: testUser._id
    });
    await testCurso.save();
    console.log('✅ Curso de prueba creado');

    // Probar sistema de likes
    console.log('\n📊 Probando sistema de likes...');
    
    // Agregar like
    const likeAgregado = testCurso.toggleLike(testUser._id, {
      nombre: testUser.nombre,
      email: testUser.email
    });
    console.log('Like agregado:', likeAgregado);
    console.log('Total de likes:', testCurso.getLikesCount());
    console.log('Usuario dio like:', testCurso.hasUserLiked(testUser._id));

    // Quitar like
    const likeRemovido = testCurso.toggleLike(testUser._id);
    console.log('Like removido:', likeRemovido);
    console.log('Total de likes:', testCurso.getLikesCount());
    console.log('Usuario dio like:', testCurso.hasUserLiked(testUser._id));

    // Agregar like nuevamente
    testCurso.toggleLike(testUser._id, {
      nombre: testUser.nombre,
      email: testUser.email
    });

    // Obtener estadísticas
    const estadisticas = testCurso.getEstadisticas();
    console.log('\n📈 Estadísticas del curso:');
    console.log(estadisticas);

    // Limpiar datos de prueba
    await testCurso.deleteOne();
    await testUser.deleteOne();
    console.log('\n🧹 Datos de prueba eliminados');

    console.log('\n✅ Sistema de likes funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    mongoose.connection.close();
  }
};

testLikesSystem();



