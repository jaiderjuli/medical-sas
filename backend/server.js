// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');  // Verifica que esta línea esté correcta
const especialidadRoutes = require('./routes/especialidadRoutes');

dotenv.config();
const app = express();

// Conecciones a la Bd Mongo
connectDB();

// Middlewares
app.use(express.json()); 
app.use(cors());        

// Rutas
app.use('/api/users', userRoutes);           
app.use('/api/admin/citas', appointmentRoutes); 
/*app.use('/api/doctors', doctorRoutes);*/ //esta fue la que modifique
app.use('/api/admin/medicos', doctorRoutes); // Asegúrate de que esta ruta esté correcta
app.use('/api/admin/especialidades', especialidadRoutes);


// Iniciar el servidor local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

