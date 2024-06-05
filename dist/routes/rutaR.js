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
    console.log(ruta);
    try {
        const rutaDB = yield rutas_model_1.Ruta.create(ruta);
        res.status(201).json({
            ok: true,
            ruta: rutaDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error ', err });
    }
}));
//actializar
rutaRoutes.post('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idruta = req.body._id;
    const updatedRutaData = req.body;
    console.log(updatedRutaData);
    try {
        const rutaDB = yield rutas_model_1.Ruta.findByIdAndUpdate(idruta, updatedRutaData, { new: true });
        if (!rutaDB) {
            return res.status(404).json({ message: 'Parte no encontrada' });
        }
        res.status(200).json({
            ok: true,
            ruta: rutaDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al actualizar la ruta', err });
    }
}));
rutaRoutes.get('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ruta = yield rutas_model_1.Ruta.findById(id).populate('vehicle').populate('users').populate('name');
        if (ruta) {
            res.json({
                ok: true,
                ruta: ruta
            });
        }
        else {
            res.status(404).json({ message: 'ruta no encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
}));
rutaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eliminado = false;
    try {
        const rutas = yield rutas_model_1.Ruta.find({ eliminado: eliminado }).populate('vehicle').populate('users').populate('name');
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
    const eliminado = false;
    try {
        const rutas = yield rutas_model_1.Ruta.find({ date: date }, { eliminado: eliminado }).populate('users').populate('vehicle').populate('name');
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
