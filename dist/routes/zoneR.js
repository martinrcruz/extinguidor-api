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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zone_model_1 = require("../models/zone.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const zoneRoutes = (0, express_1.Router)();
/* Ping ─────────────────────────────────────── */
zoneRoutes.get('/prueba', (_req, res) => {
    res.json({ ok: true, data: { message: 'todo ok' } });
});
/* Crear ────────────────────────────────────── */
zoneRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zoneDB = yield zone_model_1.Zone.create(req.body);
        res.status(201).json({ ok: true, data: { zone: zoneDB } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al crear zona', message: err.message });
    }
}));
/* Actualizar ─────────────────────────────────
 *  Recibe el _id en el body, igual que el frontend.   */
zoneRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { _id } = _a, update = __rest(_a, ["_id"]);
    if (!_id) {
        return res.status(400).json({ ok: false, error: 'ID requerido para actualizar' });
    }
    try {
        const zonaActualizada = yield zone_model_1.Zone.findByIdAndUpdate(_id, update, {
            new: true,
            runValidators: true,
        });
        if (!zonaActualizada) {
            return res.status(404).json({ ok: false, error: 'Zona no encontrada' });
        }
        res.json({ ok: true, data: { zone: zonaActualizada } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al actualizar zona', message: error.message });
    }
}));
/* Eliminar ─────────────────────────────────── */
zoneRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zonaEliminada = yield zone_model_1.Zone.findByIdAndDelete(req.params.id);
        if (!zonaEliminada) {
            return res.status(404).json({ ok: false, error: 'Zona no encontrada' });
        }
        res.json({ ok: true, data: { zone: zonaEliminada } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al eliminar zona', message: error.message });
    }
}));
/* Listar todas ─────────────────────────────── */
zoneRoutes.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zones = yield zone_model_1.Zone.find().populate({ path: 'codezip', select: 'name codezip' });
        res.json({ ok: true, data: { zones } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al obtener zonas', message: err.message });
    }
}));
/* Obtener una ──────────────────────────────── */
zoneRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zone = yield zone_model_1.Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ ok: false, error: 'Zona no encontrada' });
        }
        res.json({ ok: true, data: { zone } });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener zona', message: error.message });
    }
}));
exports.default = zoneRoutes;
