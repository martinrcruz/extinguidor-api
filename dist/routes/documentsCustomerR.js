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
const documentsCustomer_model_1 = require("../models/documentsCustomer.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const documentscustomerRouter = (0, express_1.Router)();
documentscustomerRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
documentscustomerRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentscustomer = req.body;
    try {
        const documentscustomerDB = yield documentsCustomer_model_1.DocumentCustomer.create(documentscustomer);
        res.status(201).json({
            ok: true,
            documentscustomer: documentscustomerDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
documentscustomerRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Documentscustomer por su ID
documentscustomerRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
documentscustomerRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentscustomers = yield documentsCustomer_model_1.DocumentCustomer.find();
        res.json({
            ok: true,
            documentscustomers: documentscustomers
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los documentos', error });
    }
}));
