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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarQuery = exports.validarParametros = exports.validarDatos = void 0;
const class_sanitizer_1 = require("class-sanitizer");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validarDatos = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    const typedRules = rules;
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
            }
            else {
                // Si es una clase DTO, usar validación original
                const dtoObject = (0, class_transformer_1.plainToClass)(schema, req.body);
                yield (0, class_validator_1.validate)(dtoObject, { skipMissingProperties: true });
                (0, class_sanitizer_1.sanitize)(dtoObject);
                req.body = dtoObject;
                console.log('[VALIDACIÓN] Validación de clase DTO completada exitosamente');
            }
            console.log('[VALIDACIÓN] Llamando a next()');
            next();
        }
        catch (error) {
            console.error('[VALIDACIÓN] ===========================');
            console.error('[VALIDACIÓN] ERROR EN VALIDACIÓN');
            console.error('[VALIDACIÓN] Error completo:', error);
            console.error('[VALIDACIÓN] Error message:', error === null || error === void 0 ? void 0 : error.message);
            console.error('[VALIDACIÓN] Error stack:', error === null || error === void 0 ? void 0 : error.stack);
            console.error('[VALIDACIÓN] Error toString:', error === null || error === void 0 ? void 0 : error.toString());
            console.error('[VALIDACIÓN] ===========================');
            res.status(400).json({
                ok: false,
                error: 'Datos de entrada inválidos',
                detalles: (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : error.toString()) || 'Error de validación'
            });
        }
    });
};
exports.validarDatos = validarDatos;
const validarParametros = (parametros) => {
    return (req, res, next) => {
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
exports.validarParametros = validarParametros;
const validarQuery = (parametros) => {
    return (req, res, next) => {
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
exports.validarQuery = validarQuery;
