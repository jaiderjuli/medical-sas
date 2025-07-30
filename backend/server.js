// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');  // Verifica que esta línea esté correcta

dotenv.config();
const app = express();

// Conecciones a la Bd Mongo
connectDB();

// Middlewares
app.use(express.json()); 
app.use(cors());        

// Rutas
app.use('/api/users', userRoutes);           
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/doctors', doctorRoutes);       

// Iniciar el servidor local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

