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
const customers_model_1 = require("../models/customers.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const customerRoutes = (0, express_1.Router)();
customerRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    });
});
customerRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const customerDB = yield customers_model_1.Customer.create(data);
        res.status(201).json({
            ok: true,
            data: { customer: customerDB }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al crear cliente',
            message: err.message
        });
    }
}));
//actializar
customerRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        const updated = yield customers_model_1.Customer.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({
                ok: false,
                error: 'Cliente no encontrado',
                message: 'Cliente no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { customer: updated }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar cliente',
            message: err.message
        });
    }
}));
// Ruta para eliminar un scustomer por su ID
customerRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield customers_model_1.Customer.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                ok: false,
                error: 'Cliente no encontrado',
                message: 'Cliente no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { message: 'Cliente eliminado correctamente' }
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            error: 'Error al eliminar cliente',
            message: err.message
        });
    }
}));
customerRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield customers_model_1.Customer.find().populate('zone');
        res.json({
            ok: true,
            data: { customers }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener clientes',
            message: error.message
        });
    }
}));
customerRoutes.get('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const customer = yield customers_model_1.Customer.findById(id).populate('zone');
        if (!customer) {
            return res.status(404).json({
                ok: false,
                error: 'Cliente no encontrado',
                message: 'Cliente no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { customer }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener cliente',
            message: error.message
        });
    }
}));
exports.default = customerRoutes;
