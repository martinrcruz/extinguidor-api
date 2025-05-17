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
const documentsParte_model_1 = require("../models/documentsParte.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const documentsparteRouter = (0, express_1.Router)();
documentsparteRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    });
});
documentsparteRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentsparte = req.body;
    try {
        const documentsparteDB = yield documentsParte_model_1.DocumentParte.create(documentsparte);
        res.status(201).json({
            ok: true,
            data: { documentsparte: documentsparteDB }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al crear documento',
            message: err.message
        });
    }
}));
//actializar
documentsparteRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Documentsparte por su ID
documentsparteRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
documentsparteRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentspartes = yield documentsParte_model_1.DocumentParte.find();
        res.json({
            ok: true,
            data: { documentspartes }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener documentos',
            message: error.message
        });
    }
}));
// Ruta para obtener un documento específico
documentsparteRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const documentsparte = yield documentsParte_model_1.DocumentParte.findById(id);
        if (!documentsparte) {
            return res.status(404).json({
                ok: false,
                error: 'Documento no encontrado',
                message: 'Documento no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { documentsparte }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener documento',
            message: error.message
        });
    }
}));
