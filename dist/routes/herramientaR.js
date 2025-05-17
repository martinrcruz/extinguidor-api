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
const express_1 = require("express");
const herramienta_model_1 = require("../models/herramienta.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const herramientaRoutes = (0, express_1.Router)();
/**
 * GET /herramientas
 * Obtener todas las herramientas.
 */
herramientaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const herramientas = yield herramienta_model_1.Herramienta.find();
        res.json({
            ok: true,
            data: { herramientas }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener herramientas',
            message: error.message
        });
    }
}));
/**
 * GET /herramientas/:id
 * Obtener una herramienta por su ID.
 */
herramientaRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const herramienta = yield herramienta_model_1.Herramienta.findById(id);
        if (!herramienta) {
            return res.status(404).json({
                ok: false,
                error: 'Herramienta no encontrada',
                message: 'Herramienta no encontrada'
            });
        }
        res.json({
            ok: true,
            data: { herramienta }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener herramienta',
            message: error.message
        });
    }
}));
/**
 * POST /herramientas/create
 * Crear una nueva herramienta.
 * Reglas de negocio:
 *  - El campo "name" es obligatorio y único.
 *  - El campo "description" es obligatorio.
 */
herramientaRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // Validar campos requeridos
    if (!body.name) {
        return res.status(400).json({
            ok: false,
            error: 'Campo requerido',
            message: 'El nombre es obligatorio'
        });
    }
    if (!body.description) {
        return res.status(400).json({
            ok: false,
            error: 'Campo requerido',
            message: 'La descripción es obligatoria'
        });
    }
    try {
        const herramienta = new herramienta_model_1.Herramienta({
            name: body.name,
            description: body.description,
            code: body.code,
        });
        const herramientaDB = yield herramienta.save();
        res.status(201).json({
            ok: true,
            data: {
                herramienta: herramientaDB,
                message: 'Herramienta creada exitosamente'
            }
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                error: 'Nombre duplicado',
                message: 'El nombre de la herramienta ya existe'
            });
        }
        res.status(500).json({
            ok: false,
            error: 'Error al crear herramienta',
            message: error.message
        });
    }
}));
/**
 * PUT /herramientas/update/:id
 * Actualizar una herramienta existente.
 * Reglas de negocio:
 *  - No se permite actualizar el nombre a uno que ya exista.
 *  - Se deben cumplir las validaciones definidas en el modelo.
 */
herramientaRoutes.put('/update/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const body = req.body;
    try {
        if (body.name) {
            const duplicate = yield herramienta_model_1.Herramienta.findOne({ name: body.name, _id: { $ne: id } });
            if (duplicate) {
                return res.status(400).json({
                    ok: false,
                    error: 'Nombre duplicado',
                    message: 'El nombre de la herramienta ya está en uso'
                });
            }
        }
        const herramientaUpdated = yield herramienta_model_1.Herramienta.findByIdAndUpdate(id, body, { new: true });
        if (!herramientaUpdated) {
            return res.status(404).json({
                ok: false,
                error: 'Herramienta no encontrada',
                message: 'Herramienta no encontrada'
            });
        }
        res.json({
            ok: true,
            data: {
                herramienta: herramientaUpdated,
                message: 'Herramienta actualizada correctamente'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar herramienta',
            message: error.message
        });
    }
}));
/**
 * DELETE /herramientas/:id
 * Eliminar una herramienta.
 */
herramientaRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const herramientaDeleted = yield herramienta_model_1.Herramienta.findByIdAndDelete(id);
        if (!herramientaDeleted) {
            return res.status(404).json({
                ok: false,
                error: 'Herramienta no encontrada',
                message: 'Herramienta no encontrada'
            });
        }
        res.json({
            ok: true,
            data: {
                herramienta: herramientaDeleted,
                message: 'Herramienta eliminada correctamente'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al eliminar herramienta',
            message: error.message
        });
    }
}));
exports.default = herramientaRoutes;
