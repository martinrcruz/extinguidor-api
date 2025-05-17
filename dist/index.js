"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const userR_1 = __importDefault(require("./routes/userR"));
const vehicleR_1 = __importDefault(require("./routes/vehicleR"));
const rutaR_1 = __importDefault(require("./routes/rutaR"));
const customersR_1 = __importDefault(require("./routes/customersR"));
const zoneR_1 = __importDefault(require("./routes/zoneR"));
const parteR_1 = __importDefault(require("./routes/parteR"));
const rutaNR_1 = __importDefault(require("./routes/rutaNR"));
const materialR_1 = __importDefault(require("./routes/materialR"));
const materialparteR_1 = __importDefault(require("./routes/materialparteR"));
const facturacionR_1 = __importDefault(require("./routes/facturacionR"));
const alertR_1 = __importDefault(require("./routes/alertR"));
const herramientaR_1 = __importDefault(require("./routes/herramientaR"));
const contractR_1 = __importDefault(require("./routes/contractR"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const rate_limiter_1 = require("./middlewares/rate-limiter");
const logger_1 = require("./middlewares/logger");
const articuloR_1 = __importDefault(require("./routes/articuloR"));
const zipcodeR_1 = __importDefault(require("./routes/zipcodeR"));
// Cargar variables de entorno
(0, dotenv_1.config)();
const server = new server_1.default();
// Middleware de seguridad
// Configurar helmet para permitir CORS
server.app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
// Compresión de respuestas
server.app.use((0, compression_1.default)());
// Logging
server.app.use((0, morgan_1.default)('dev'));
server.app.use(logger_1.requestLogger);
// Rate limiting
server.app.use(rate_limiter_1.generalLimiter);
server.app.use('/user/login', rate_limiter_1.authLimiter);
server.app.use('/user/register', rate_limiter_1.authLimiter);
server.app.use('/partes/upload', rate_limiter_1.uploadLimiter);
// Aplicamos limiter específico para rutas de worker
server.app.use('/partes/worker', rate_limiter_1.workerLimiter);
// Body parser con límites
server.app.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: '10mb'
}));
server.app.use(body_parser_1.default.json({
    limit: '10mb'
}));
// File upload con validaciones
server.app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: 'El archivo excede el tamaño máximo permitido'
}));
// CORS config
// Permitimos cualquier origen en desarrollo y solo orígenes específicos en producción
const isProduction = process.env.NODE_ENV === 'production';
const corsOptions = {
    origin: isProduction
        ? ['https://extinguidor-frontend.vercel.app', 'https://extinguidor-frontend.netlify.app', 'https://extinguidor.app', 'https://www.extinguidor.app', 'https://app.extinguidor.com', 'https://elextinguidorapp.es', 'https://www.elextinguidorapp.es']
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 horas
};
server.app.use((0, cors_1.default)(corsOptions));
// Conexión a MongoDB con manejo de errores mejorado
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://devsquaadsextinguidor:dFuBc8XttwIsU7pT@cluster0.zvnsihq.mongodb.net/";
        yield mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Base de datos online');
    }
    catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
});
// Middleware de manejo de errores global
server.app.use(logger_1.errorLogger);
server.app.use(rate_limiter_1.handleRateLimitError);
server.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        ok: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message
    });
});
// Rutas
server.app.use('/user', userR_1.default);
server.app.use('/facturacion', facturacionR_1.default);
server.app.use('/vehicle', vehicleR_1.default);
server.app.use('/rutas', rutaR_1.default);
server.app.use('/rutasn', rutaNR_1.default);
server.app.use('/customers', customersR_1.default);
server.app.use('/contract', contractR_1.default);
server.app.use('/zone', zoneR_1.default);
server.app.use('/partes', parteR_1.default); // También implementa endpoints de calendario: /calendario/:date/partes-no-asignados, /calendario/:date/partes-finalizados, /calendario/:date/rutas
server.app.use('/material', materialR_1.default);
server.app.use('/materialparte', materialparteR_1.default);
server.app.use('/alertas', alertR_1.default);
server.app.use('/herramientas', herramientaR_1.default);
server.app.use('/zipcode', zipcodeR_1.default);
server.app.use('/articulos', articuloR_1.default);
// Iniciar servidor
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        server.start(() => {
            console.log(`Servidor corriendo en puerto ${server.port}`);
        });
    }
    catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
});
startServer();
