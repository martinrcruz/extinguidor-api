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
const facturacion_model_1 = require("../models/facturacion.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const facturacionRoutes = (0, express_1.Router)();
facturacionRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
facturacionRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const facturacion = req.body;
    try {
        const facturacionDB = yield facturacion_model_1.Facturacion.create(facturacion);
        res.status(201).json({
            ok: true,
            facturacion: facturacionDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
facturacionRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
facturacionRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
facturacionRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturacions = yield facturacion_model_1.Facturacion.find();
        res.json({
            ok: true,
            facturacion: facturacions
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los zonas', error });
    }
}));
facturacionRoutes.get('/ruta/:ruta', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.params.ruta;
    try {
        const facturacions = yield facturacion_model_1.Facturacion.find({ ruta: ruta }).populate('parte');
        res.json({
            ok: true,
            facturacion: facturacions
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los zonas', error });
    }
}));
exports.default = facturacionRoutes;
