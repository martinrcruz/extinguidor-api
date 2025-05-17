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
        data: { message: 'todo ok' }
    });
});
vehicleRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicle = req.body;
    try {
        const vehicleDB = yield vehicle_model_1.Vehicle.create(vehicle);
        res.status(201).json({
            ok: true,
            data: { vehicle: vehicleDB }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al crear vehículo',
            message: err.message
        });
    }
}));
//actializar
vehicleRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                ok: false,
                error: 'ID no proporcionado',
                message: 'Se requiere el ID del vehículo'
            });
        }
        const updated = yield vehicle_model_1.Vehicle.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: 'Vehículo no encontrado',
                message: 'Vehículo no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { vehicle: updated }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar vehículo',
            message: err.message
        });
    }
}));
// Ruta para eliminar un vehicle por su ID
vehicleRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield vehicle_model_1.Vehicle.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                ok: false,
                error: 'Vehículo no encontrado',
                message: 'Vehículo no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { message: 'Vehículo eliminado correctamente' }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al eliminar vehículo',
            message: err.message
        });
    }
}));
//obtener vehicles
vehicleRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield vehicle_model_1.Vehicle.find();
        res.json({
            ok: true,
            data: { vehicles }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener vehículos',
            message: error.message
        });
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
                data: { vehicle }
            });
        }
        else {
            res.status(404).json({
                ok: false,
                error: 'Vehículo no encontrado',
                message: 'Vehículo no encontrado'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener vehículo',
            message: error.message
        });
    }
}));
exports.default = vehicleRoutes;
