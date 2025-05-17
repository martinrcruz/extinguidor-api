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
const material_model_1 = require("../models/material.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const materialRouter = (0, express_1.Router)();
materialRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    });
});
materialRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const material = req.body;
    try {
        const materialDB = yield material_model_1.Material.create(material);
        res.status(201).json({
            ok: true,
            data: { material: materialDB }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al crear material',
            message: err.message
        });
    }
}));
//actializar
materialRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                ok: false,
                error: 'ID no proporcionado',
                message: 'Se requiere el ID del material'
            });
        }
        const updated = yield material_model_1.Material.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: 'Material no encontrado',
                message: 'Material no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { material: updated }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar material',
            message: err.message
        });
    }
}));
// Ruta para eliminar un Material por su ID
materialRouter.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield material_model_1.Material.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                ok: false,
                error: 'Material no encontrado',
                message: 'Material no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { message: 'Material eliminado correctamente' }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al eliminar material',
            message: err.message
        });
    }
}));
materialRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const materials = yield material_model_1.Material.find();
        res.json({
            ok: true,
            data: { materials }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener materiales',
            message: error.message
        });
    }
}));
//obtener material
materialRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const material = yield material_model_1.Material.findById(id);
        if (!material) {
            return res.status(404).json({
                ok: false,
                error: 'Material no encontrado',
                message: 'Material no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { material }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener material',
            message: error.message
        });
    }
}));
exports.default = materialRouter;
