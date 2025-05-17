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
const facturacion_model_1 = require("../models/facturacion.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const facturacionRoutes = (0, express_1.Router)();
/* ─────────────────────────────────────────────
 *  GET  /facturacion/prueba  (ping)
 * ───────────────────────────────────────────── */
facturacionRoutes.get('/prueba', (_req, res) => {
    res.json({ ok: true, data: { message: 'todo ok' } });
});
/* ─────────────────────────────────────────────
 *  POST /facturacion/create
 * ───────────────────────────────────────────── */
facturacionRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturacionDB = yield facturacion_model_1.Facturacion.create(req.body);
        res.status(201).json({ ok: true, data: { facturacion: facturacionDB } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al crear facturación', message: err.message });
    }
}));
/* ─────────────────────────────────────────────
 *  PUT /facturacion/update/:id
 * ───────────────────────────────────────────── */
facturacionRoutes.put('/update/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const facturacionActualizada = yield facturacion_model_1.Facturacion.findByIdAndUpdate(id, req.body, // campos a actualizar
        { new: true, runValidators: true })
            .populate({
            path: 'ruta',
            select: 'name',
            populate: { path: 'name', select: 'name' }
        })
            .populate({ path: 'parte', select: 'description' });
        if (!facturacionActualizada) {
            return res.status(404).json({ ok: false, error: 'Facturación no encontrada' });
        }
        res.json({ ok: true, data: { facturacion: facturacionActualizada } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al actualizar facturación', message: error.message });
    }
}));
/* ─────────────────────────────────────────────
 *  DELETE /facturacion/:id
 * ───────────────────────────────────────────── */
facturacionRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield facturacion_model_1.Facturacion.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ ok: false, error: 'Facturación no encontrada' });
        }
        res.json({ ok: true, data: { facturacion: result } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al eliminar facturación', message: error.message });
    }
}));
/* ─────────────────────────────────────────────
 *  GET /facturacion         (todas)
 *  GET /facturacion/ruta/:ruta
 *  GET /facturacion/:id      (una)
 * ───────────────────────────────────────────── */
facturacionRoutes.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturaciones = yield facturacion_model_1.Facturacion.find()
            .populate({ path: 'ruta', select: 'name', populate: { path: 'name', select: 'name' } })
            .populate({ path: 'parte', select: 'description' });
        res.json({ ok: true, data: { facturacion: facturaciones } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener facturaciones', message: error.message });
    }
}));
facturacionRoutes.get('/ruta/:ruta', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturaciones = yield facturacion_model_1.Facturacion.find({ ruta: req.params.ruta }).populate('parte');
        res.json({ ok: true, data: { facturacion: facturaciones } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener facturaciones por ruta', message: error.message });
    }
}));
facturacionRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturacion = yield facturacion_model_1.Facturacion.findById(req.params.id)
            .populate({ path: 'ruta', select: 'name', populate: { path: 'name', select: 'name' } })
            .populate({ path: 'parte', select: 'description' });
        if (!facturacion) {
            return res.status(404).json({ ok: false, error: 'Facturación no encontrada' });
        }
        res.json({ ok: true, data: { facturacion } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener facturación', message: error.message });
    }
}));
exports.default = facturacionRoutes;
