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
const autenticacion_1 = require("../middlewares/autenticacion");
const parte_model_1 = require("../models/parte.model");
const parteRoutes = (0, express_1.Router)();
parteRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
parteRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parte = req.body;
    try {
        const parteDB = yield parte_model_1.Parte.create(parte);
        res.status(201).json({
            ok: true,
            parte: parteDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
parteRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
parteRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
parteRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partes = yield parte_model_1.Parte.find().populate('customer').populate('zone').populate('ruta');
        res.json({
            ok: true,
            partes: partes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/ruta/:ruta', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.params.ruta;
    try {
        const partes = yield parte_model_1.Parte.find({ ruta: ruta }).populate('customer').populate('zone');
        res.json({
            ok: true,
            partes: partes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
parteRoutes.get('/noasignado/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaInicio = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaInicio.getDate() + 30);
    const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;
    const noasignado = false;
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: noasignado,
            date: {
                $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).populate('customer').populate('zone');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/noasignado/:fecha', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = req.params.fecha;
    const noasignado = false;
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: noasignado,
            date: fecha
        }).populate('customer').populate('zone');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/asignado/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaInicio = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaInicio.getDate() + 30);
    const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;
    const asignado = true;
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: asignado,
            date: {
                $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).populate('customer').populate('zone').populate('ruta');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
exports.default = parteRoutes;
