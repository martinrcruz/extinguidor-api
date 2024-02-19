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
const rutas_model_1 = require("../models/rutas.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const rutaRoutes = (0, express_1.Router)();
rutaRoutes.get('/prueba', autenticacion_1.verificarToken, (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
rutaRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.body;
    ruta.state = 'pendiente';
    console.log(ruta);
    try {
        const rutaDB = yield rutas_model_1.Ruta.create(ruta);
        res.status(201).json({
            ok: true,
            ruta: rutaDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
rutaRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Ruta por su ID
rutaRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
rutaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rutas = yield rutas_model_1.Ruta.find().populate('vehicle').populate('users');
        res.json({
            ok: true,
            rutas: rutas
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
rutaRoutes.get('/fecha/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.params.date;
    try {
        const rutas = yield rutas_model_1.Ruta.find({ date: date }).populate('users').populate('vehicle');
        res.json({
            ok: true,
            rutas: rutas
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
exports.default = rutaRoutes;
