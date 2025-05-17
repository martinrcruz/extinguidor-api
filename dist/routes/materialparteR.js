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
const materialParte_model_1 = require("../models/materialParte.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const materialParteRouter = (0, express_1.Router)();
materialParteRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    });
});
materialParteRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const materialParte = req.body;
    try {
        const materialParteDB = yield materialParte_model_1.MaterialParte.create(materialParte);
        res.status(201).json({
            ok: true,
            data: { materialParte: materialParteDB }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al crear material de parte',
            message: err.message
        });
    }
}));
//actializar
materialParteRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un MaterialParte por su ID
materialParteRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
materialParteRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const materialPartes = yield materialParte_model_1.MaterialParte.find().populate('material');
        res.json({
            ok: true,
            data: { materialPartes }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener materiales de parte',
            message: error.message
        });
    }
}));
//obtener materialParte por ruta
materialParteRouter.get('/:ruta', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.params.ruta;
    try {
        const materialPartes = yield materialParte_model_1.MaterialParte.find({ ruta: ruta }).populate('material');
        res.json({
            ok: true,
            data: { materialPartes }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener materiales de parte',
            message: error.message
        });
    }
}));
exports.default = materialParteRouter;
