import { Request, Response, NextFunction } from 'express';
import { sanitize } from 'class-sanitizer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const validarDatos = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('[VALIDACIÓN] Iniciando validación');
            console.log('[VALIDACIÓN] Schema type:', typeof schema);
            console.log('[VALIDACIÓN] req.body keys:', Object.keys(req.body || {}));
            
            // Verificar si schema es un objeto plano
            if (!schema) {
                console.log('[VALIDACIÓN] Schema es null/undefined, continuando...');
                return next();
            }
            
            const isFunction = typeof schema === 'function';
            const hasPrototype = schema && typeof schema.prototype !== 'undefined';
            const isPlainObject = !isFunction && !hasPrototype;
            
            console.log('[VALIDACIÓN] isFunction:', isFunction, 'hasPrototype:', hasPrototype, 'isPlainObject:', isPlainObject);
            
            if (isPlainObject && schema) {
                // Validación simple para objetos planos
                console.log('[VALIDACIÓN] Usando validación de objeto plano');
                for (const [field, rules] of Object.entries(schema)) {
                    const value = req.body[field];
                    const typedRules = rules as any;

                    // Validar campo requerido (permitir false y 0 como valores válidos)
                    if (typedRules.required && (value === undefined || value === null || value === '')) {
                        console.log(`[VALIDACIÓN] Campo '${field}' es requerido pero está vacío:`, value);
                        return res.status(400).json({
                            ok: false,
                            error: 'Datos de entrada inválidos',
                            detalles: `El campo '${field}' es requerido`
                        });
                    }

                    // Validar tipo solo si el valor existe (incluyendo false y 0)
                    if (value !== undefined && value !== null) {
                        if (typedRules.type === 'string' && typeof value !== 'string') {
                            return res.status(400).json({
                                ok: false,
                                error: 'Datos de entrada inválidos',
                                detalles: `El campo '${field}' debe ser un string`
                            });
                        }
                        if (typedRules.type === 'date') {
                            const dateValue = new Date(value);
                            if (isNaN(dateValue.getTime())) {
                                return res.status(400).json({
                                    ok: false,
                                    error: 'Datos de entrada inválidos',
                                    detalles: `El campo '${field}' debe ser una fecha válida`
                                });
                            }
                        }
                        if (typedRules.type === 'number' && typeof value !== 'number') {
                            return res.status(400).json({
                                ok: false,
                                error: 'Datos de entrada inválidos',
                                detalles: `El campo '${field}' debe ser un número`
                            });
                        }
                        if (typedRules.type === 'boolean' && typeof value !== 'boolean') {
                            return res.status(400).json({
                                ok: false,
                                error: 'Datos de entrada inválidos',
                                detalles: `El campo '${field}' debe ser un boolean`
                            });
                        }
                        if (typedRules.type === 'array' && !Array.isArray(value)) {
                            return res.status(400).json({
                                ok: false,
                                error: 'Datos de entrada inválidos',
                                detalles: `El campo '${field}' debe ser un array`
                            });
                        }

                        // Validar enum
                        if (typedRules.enum && !typedRules.enum.includes(value)) {
                            return res.status(400).json({
                                ok: false,
                                error: 'Datos de entrada inválidos',
                                detalles: `El campo '${field}' debe ser uno de: ${typedRules.enum.join(', ')}`
                            });
                        }

                        // Validar maxLength
                        if (typedRules.maxLength && typeof value === 'string' && value.length > typedRules.maxLength) {
                            return res.status(400).json({
                                ok: false,
                                error: 'Datos de entrada inválidos',
                                detalles: `El campo '${field}' no puede exceder ${typedRules.maxLength} caracteres`
                            });
                        }
                    }
                }
                console.log('[VALIDACIÓN] Validación de objeto plano completada exitosamente');
            } else {
                // Si es una clase DTO, usar validación original
                const dtoObject = plainToClass(schema, req.body);
                await validate(dtoObject, { skipMissingProperties: true });
                sanitize(dtoObject);
                req.body = dtoObject;
                console.log('[VALIDACIÓN] Validación de clase DTO completada exitosamente');
            }
            console.log('[VALIDACIÓN] Llamando a next()');
            next();
        } catch (error: any) {
            console.error('[VALIDACIÓN] ===========================');
            console.error('[VALIDACIÓN] ERROR EN VALIDACIÓN');
            console.error('[VALIDACIÓN] Error completo:', error);
            console.error('[VALIDACIÓN] Error message:', error?.message);
            console.error('[VALIDACIÓN] Error stack:', error?.stack);
            console.error('[VALIDACIÓN] Error toString:', error?.toString());
            console.error('[VALIDACIÓN] ===========================');
            res.status(400).json({
                ok: false,
                error: 'Datos de entrada inválidos',
                detalles: error?.message || error?.toString() || 'Error de validación'
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