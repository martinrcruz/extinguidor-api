import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Limiter general para todas las rutas - Ampliado para ser menos restrictivo
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 300, // límite aumentado a 300 peticiones por ventana (era 100)
    message: {
        ok: false,
        error: 'Demasiadas peticiones, por favor intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // No contar peticiones exitosas
});

// Limiter específico para rutas de worker
export const workerLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto 
    max: 60, // 60 peticiones por minuto (1 por segundo)
    message: {
        ok: false,
        error: 'Demasiadas solicitudes desde la aplicación móvil, por favor espere unos momentos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // No contar peticiones exitosas
});

// Limiter específico para autenticación
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 intentos por hora
    message: {
        ok: false,
        error: 'Demasiados intentos de inicio de sesión, por favor intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Limiter para subida de archivos
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // 10 archivos por hora
    message: {
        ok: false,
        error: 'Demasiadas subidas de archivos, por favor intente más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Middleware para manejar errores de rate limit
export const handleRateLimitError = (err: any, req: Request, res: Response, next: any) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            ok: false,
            error: 'El archivo es demasiado grande'
        });
    }
    next(err);
}; 