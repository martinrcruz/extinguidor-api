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
const salas_model_1 = require("../models/salas.model");
const espfisicos_model_1 = require("../models/espfisicos.model");
const salaRoutes = (0, express_1.Router)();
salaRoutes.get('/:espacioFisicoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { espacioFisicoId } = req.params;
        const salas = yield salas_model_1.Sala.find({ espacioFisico: espacioFisicoId });
        res.json({
            ok: true,
            salas
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener las salas',
            error: err
        });
    }
}));
salaRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, capacidad, descripcion, espacioFisico } = req.body;
        const sala = new salas_model_1.Sala({
            nombre,
            capacidad,
            descripcion,
            espacioFisico
        });
        yield sala.save();
        yield espfisicos_model_1.EspacioFisico.findByIdAndUpdate(espacioFisico, { $push: { salas: sala._id } });
        res.json({
            ok: true,
            sala
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear la sala',
            error: err
        });
    }
}));
exports.default = salaRoutes;
