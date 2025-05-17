"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_2 = require("winston");
// Configuración del logger
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_2.format.combine(winston_2.format.timestamp(), winston_2.format.json()),
    transports: [
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' })
    ]
});
// Si no estamos en producción, también mostramos los logs en consola
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_2.format.combine(winston_2.format.colorize(), winston_2.format.simple())
    }));
}
// Middleware de logging
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    next();
};
exports.requestLogger = requestLogger;
// Middleware para logging de errores
const errorLogger = (err, req, res, next) => {
    logger.error({
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next(err);
};
exports.errorLogger = errorLogger;
exports.default = logger;
