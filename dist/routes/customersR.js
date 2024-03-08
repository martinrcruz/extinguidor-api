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
        mje: 'todo ok'
    });
});
customerRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.body;
    try {
        const customerDB = yield customers_model_1.Customer.create(customer);
        res.status(201).json({
            ok: true,
            customer: customerDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
customerRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un scustomer por su ID
customerRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
customerRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield customers_model_1.Customer.find().populate('zone');
        res.json({
            ok: true,
            customers: customers
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener customers', error });
    }
}));
exports.default = customerRoutes;
