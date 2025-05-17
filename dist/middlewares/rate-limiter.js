"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRateLimitError = exports.uploadLimiter = exports.authLimiter = exports.workerLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Limiter general para todas las rutas - Ampliado para ser menos restrictivo
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        ok: false,
        error: 'Demasiadas peticiones, por favor intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // No contar peticiones exitosas
});
// Limiter específico para rutas de worker
exports.workerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: {
        ok: false,
        error: 'Demasiadas solicitudes desde la aplicación móvil, por favor espere unos momentos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // No contar peticiones exitosas
});
// Limiter específico para autenticación
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        ok: false,
        error: 'Demasiados intentos de inicio de sesión, por favor intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Limiter para subida de archivos
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        ok: false,
        error: 'Demasiadas subidas de archivos, por favor intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Middleware para manejar errores de rate limit
const handleRateLimitError = (err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            ok: false,
            error: 'El archivo es demasiado grande'
        });
    }
    next(err);
};
exports.handleRateLimitError = handleRateLimitError;
