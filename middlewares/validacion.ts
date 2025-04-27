import { Request, Response, NextFunction } from 'express';
import { sanitize } from 'class-sanitizer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const validarDatos = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dtoObject = plainToClass(dtoClass, req.body);
            await validate(dtoObject, { skipMissingProperties: true });
            sanitize(dtoObject);
            req.body = dtoObject;
            next();
        } catch (error: any) {
            res.status(400).json({
                ok: false,
                error: 'Datos de entrada inválidos',
                detalles: error.message
            });
        }
    };
};

export const validarParametros = (parametros: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const faltantes = parametros.filter(param => !req.params[param]);
        if (faltantes.length > 0) {
            return res.status(400).json({
                ok: false,
                error: `Parámetros requeridos faltantes: ${faltantes.join(', ')}`
            });
        }
        next();
    };
};

export const validarQuery = (parametros: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const faltantes = parametros.filter(param => !req.query[param]);
        if (faltantes.length > 0) {
            return res.status(400).json({
                ok: false,
                error: `Parámetros de consulta requeridos faltantes: ${faltantes.join(', ')}`
            });
        }
        next();
    };
}; 