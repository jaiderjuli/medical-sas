const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;

