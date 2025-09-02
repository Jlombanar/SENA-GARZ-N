import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGODB_URI;

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth routes', () => {
  const userData = {
    nombre: 'Test User',
    correo: 'test@example.com',
    password: '123456'
  };

  it('🔐 Datos registrados exitosamente', async () => {
    const res = await request(app).post('/api/register').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(res.body.user).toHaveProperty('correo', userData.correo);
  });

  it('✅ Usuario ya registrado', async () => {
    await request(app).post('/api/register').send(userData);

    const res = await request(app).post('/api/register').send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El correo ya está registrado');
  });

  it('✅ Inicio de sesion correcto!', async () => {
    await request(app).post('/api/register').send(userData);

    const res = await request(app).post('/api/login').send({
      correo: userData.correo,
      password: userData.password
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login exitoso');
    expect(res.body.user).toHaveProperty('correo', userData.correo);
  });

  it('✅ Verificacion de contraseña incorrecta', async () => {
    await request(app).post('/api/register').send(userData);

    const res = await request(app).post('/api/login').send({
      correo: userData.correo,
      password: 'wrongpass'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Correo o password incorrecto!');
  });
});
