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
const alert_model_1 = require("../models/alert.model");
const alertaRouter = (0, express_1.Router)();
/**
 * GET /alertas
 * Devuelve todas las alertas
 */
alertaRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alertas = yield alert_model_1.Alert.find().exec();
        res.json({
            ok: true,
            data: { alertas }
        });
    }
    catch (err) {
        console.error('Error GET /alertas', err);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener alertas',
            message: err.message
        });
    }
}));
/**
 * PUT /alertas/:id
 * Cambia el estado de la alerta (por ejemplo, { state: 'Pendiente'|'Cerrado' })
 */
alertaRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { state } = req.body;
    try {
        const alerta = yield alert_model_1.Alert.findByIdAndUpdate(id, { state }, { new: true });
        if (!alerta) {
            return res.status(404).json({
                ok: false,
                error: 'Alerta no encontrada',
                message: 'Alerta no encontrada'
            });
        }
        res.json({
            ok: true,
            data: { alerta }
        });
    }
    catch (err) {
        console.error(`Error PUT /alertas/${id}`, err);
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar alerta',
            message: err.message
        });
    }
}));
exports.default = alertaRouter;
