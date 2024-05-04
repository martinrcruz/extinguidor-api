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
const documentspartes_model_1 = require("../models/documentspartes.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const documentsParteRouter = (0, express_1.Router)();
documentsParteRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
documentsParteRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentsParte = req.body;
    try {
        const documentsParteDB = yield documentspartes_model_1.DocumentParte.create(documentsParte);
        res.status(201).json({
            ok: true,
            documentsuser: documentsParteDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
documentsParteRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Documentsuser por su ID
documentsParteRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
documentsParteRouter.get('/:parte', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parte = req.params.parte;
    try {
        const documentsPartes = yield documentspartes_model_1.DocumentParte.find({ parte: parte });
        res.json({
            ok: true,
            documentsPartes: documentsPartes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los documentos', error });
    }
}));
