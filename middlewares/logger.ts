import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { format } from 'winston';

// Configuración del logger
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Si no estamos en producción, también mostramos los logs en consola
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

// Middleware de logging
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
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

// Middleware para logging de errores
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
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

export default logger; 