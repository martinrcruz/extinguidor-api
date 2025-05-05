import Server from "./classes/server";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/userR";
import vehicleRoutes from "./routes/vehicleR";
import rutaRoutes from "./routes/rutaR";
import customerRoutes from "./routes/customersR";
import zoneRoutes from "./routes/zoneR";
import parteRoutes from "./routes/parteR";
import rutaNRoutes from "./routes/rutaNR";
import materialRouter from "./routes/materialR";
import materialParteRouter from "./routes/materialparteR";
import facturacionRoutes from "./routes/facturacionR";
import alertaRouter from "./routes/alertR";
import herramientaRoutes from "./routes/herramientaR";
import contractRoutes from "./routes/contractR";
import { config } from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { generalLimiter, authLimiter, uploadLimiter, workerLimiter, handleRateLimitError } from './middlewares/rate-limiter';
import { requestLogger, errorLogger } from './middlewares/logger';
import articuloRoutes from './routes/articuloR';

// Cargar variables de entorno
config();

const server = new Server();

// Middleware de seguridad
// Configurar helmet para permitir CORS
server.app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
  })
);

// Compresión de respuestas
server.app.use(compression());

// Logging
server.app.use(morgan('dev'));
server.app.use(requestLogger);

// Rate limiting
server.app.use(generalLimiter);
server.app.use('/user/login', authLimiter);
server.app.use('/user/register', authLimiter);
server.app.use('/partes/upload', uploadLimiter);
// Aplicamos limiter específico para rutas de worker
server.app.use('/partes/worker', workerLimiter);

// Body parser con límites
server.app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));
server.app.use(bodyParser.json({
    limit: '10mb'
}));

// File upload con validaciones
server.app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    abortOnLimit: true,
    responseOnLimit: 'El archivo excede el tamaño máximo permitido'
}));

// CORS config
// Permitimos cualquier origen en desarrollo y solo orígenes específicos en producción
const isProduction = process.env.NODE_ENV === 'production';
const corsOptions = {
  origin: isProduction 
    ? ['https://extinguidor-frontend.vercel.app', 'https://extinguidor-frontend.netlify.app', 'https://extinguidor.app', 'https://www.extinguidor.app', 'https://app.extinguidor.com', 'https://elextinguidorapp.es', 'https://www.elextinguidorapp.es']
    : true, // Permitir cualquier origen en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-token'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 horas
};

server.app.use(cors(corsOptions));

// Conexión a MongoDB con manejo de errores mejorado
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://devsquaadsextinguidor:dFuBc8XttwIsU7pT@cluster0.zvnsihq.mongodb.net/";
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Base de datos online');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
};

// Middleware de manejo de errores global
server.app.use(errorLogger);
server.app.use(handleRateLimitError);
server.app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        ok: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : err.message
    });
});

// Rutas
server.app.use('/user', userRoutes);
server.app.use('/facturacion', facturacionRoutes);
server.app.use('/vehicle', vehicleRoutes);
server.app.use('/rutas', rutaRoutes);
server.app.use('/rutasn', rutaNRoutes);
server.app.use('/customers', customerRoutes);
server.app.use('/contract', contractRoutes);
server.app.use('/zone', zoneRoutes);
server.app.use('/partes', parteRoutes); // También implementa endpoints de calendario: /calendario/:date/partes-no-asignados, /calendario/:date/partes-finalizados, /calendario/:date/rutas
server.app.use('/material', materialRouter);
server.app.use('/materialparte', materialParteRouter);
server.app.use('/alertas', alertaRouter);
server.app.use('/herramientas', herramientaRoutes);
server.app.use('/articulos', articuloRoutes);

// Iniciar servidor
const startServer = async () => {
    try {
        await connectDB();
        server.start(() => {
            console.log(`Servidor corriendo en puerto ${server.port}`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
};

startServer();
