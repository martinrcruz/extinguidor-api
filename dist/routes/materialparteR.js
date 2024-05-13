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
        mje: 'todo ok'
    });
});
materialParteRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const materialParte = req.body;
    try {
        const materialParteDB = yield materialParte_model_1.MaterialParte.create(materialParte);
        res.status(201).json({
            ok: true,
            materialParte: materialParteDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
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
            materialPartes: materialPartes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los Zipcodes', error });
    }
}));
//obtener materialParte
materialParteRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const materialPartes = yield materialParte_model_1.MaterialParte.find();
        res.json({
            ok: true,
            materialPartes: materialPartes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener materialPartes', error });
    }
}));
exports.default = materialParteRouter;
