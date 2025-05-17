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
const validarDatos = (dtoClass) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dtoObject = (0, class_transformer_1.plainToClass)(dtoClass, req.body);
            yield (0, class_validator_1.validate)(dtoObject, { skipMissingProperties: true });
            (0, class_sanitizer_1.sanitize)(dtoObject);
            req.body = dtoObject;
            next();
        }
        catch (error) {
            res.status(400).json({
                ok: false,
                error: 'Datos de entrada inválidos',
                detalles: error.message
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
