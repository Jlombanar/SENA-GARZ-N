import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let memoryServer = null;

const connectDB = async () => {
  const targetUri = process.env.MONGODB_URI;
  const disableMemory = String(process.env.DISABLE_MEMORY_DB || "false").toLowerCase() === "true";
  try {
    if (targetUri) {
      await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 3000 });
      console.log("✅ MongoDB Conectado !");
      return;
    }
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB local:", error.message);
  }

  if (disableMemory) {
    console.error("❌ DISABLE_MEMORY_DB=true, no se usará Mongo en memoria. Configure MONGODB_URI.");
    process.exit(1);
  }

  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log("🧪 MongoDB en memoria iniciado (solo desarrollo)");
  } catch (error) {
    console.error("❌ No se pudo iniciar MongoDB en memoria:", error.message);
    process.exit(1);
  }
};

export default connectDB;