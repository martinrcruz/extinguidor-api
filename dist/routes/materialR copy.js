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
        mje: 'todo ok'
    });
});
materialRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const material = req.body;
    try {
        const materialDB = yield material_model_1.Material.create(material);
        res.status(201).json({
            ok: true,
            material: materialDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
materialRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Material por su ID
materialRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
materialRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const materials = yield material_model_1.Material.find();
        res.json({
            ok: true,
            materials: materials
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los Zipcodes', error });
    }
}));
//obtener material
materialRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const materials = yield material_model_1.Material.find();
        res.json({
            ok: true,
            materials: materials
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener materials', error });
    }
}));
exports.default = materialRouter;
