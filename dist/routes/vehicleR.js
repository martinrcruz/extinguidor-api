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
const vehicle_model_1 = require("../models/vehicle.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const vehicleRoutes = (0, express_1.Router)();
vehicleRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
vehicleRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicle = req.body;
    try {
        const vehicleDB = yield vehicle_model_1.Vehicle.create(vehicle);
        res.status(201).json({
            ok: true,
            vehicle: vehicleDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
vehicleRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un vehicle por su ID
vehicleRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
//obtener vehicles
vehicleRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield vehicle_model_1.Vehicle.find();
        res.json({
            ok: true,
            vehicles: vehicles
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los vehicles', error });
    }
}));
// Ruta para obtener un vehicle
vehicleRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const vehicle = yield vehicle_model_1.Vehicle.findById(id);
        if (vehicle) {
            res.json({
                ok: true,
                vehicle: vehicle
            });
        }
        else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
}));
exports.default = vehicleRoutes;
