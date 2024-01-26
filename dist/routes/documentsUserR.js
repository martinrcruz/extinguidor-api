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
const documentsUser_model_1 = require("../models/documentsUser.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const documentsuserRouter = (0, express_1.Router)();
documentsuserRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
documentsuserRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentsuser = req.body;
    try {
        const documentsuserDB = yield documentsUser_model_1.DocumentUser.create(documentsuser);
        res.status(201).json({
            ok: true,
            documentsuser: documentsuserDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
documentsuserRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Documentsuser por su ID
documentsuserRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
documentsuserRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentsusers = yield documentsUser_model_1.DocumentUser.find();
        res.json({
            ok: true,
            documentsusers: documentsusers
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los documentos', error });
    }
}));
