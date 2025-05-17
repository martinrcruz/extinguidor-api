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
const zipcode_model_1 = require("../models/zipcode.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const zipcodeRouter = (0, express_1.Router)();
/* Ping ───────────────────────────────────────── */
zipcodeRouter.get('/prueba', (_req, res) => res.json({ ok: true, data: { message: 'todo ok' } }));
/* Crear ──────────────────────────────────────── */
zipcodeRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zipcodeDB = yield zipcode_model_1.Zipcode.create(req.body);
        res.status(201).json({ ok: true, data: { zipcode: zipcodeDB } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al crear código postal', message: err.message });
    }
}));
/* Actualizar ─────────────────────────────────── */
zipcodeRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { _id } = _a, update = __rest(_a, ["_id"]);
    if (!_id)
        return res.status(400).json({ ok: false, error: 'ID requerido' });
    try {
        const zipUpd = yield zipcode_model_1.Zipcode.findByIdAndUpdate(_id, update, { new: true, runValidators: true });
        if (!zipUpd)
            return res.status(404).json({ ok: false, error: 'Código postal no encontrado' });
        res.json({ ok: true, data: { zipcode: zipUpd } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al actualizar código postal', message: err.message });
    }
}));
/* Eliminar ───────────────────────────────────── */
zipcodeRouter.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const z = yield zipcode_model_1.Zipcode.findByIdAndDelete(req.params.id);
        if (!z)
            return res.status(404).json({ ok: false, error: 'Código postal no encontrado' });
        res.json({ ok: true, data: { zipcode: z } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al eliminar código postal', message: err.message });
    }
}));
/* Listar ─────────────────────────────────────── */
zipcodeRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zipcodes = yield zipcode_model_1.Zipcode.find();
        res.json({ ok: true, data: { zipcodes } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al obtener códigos postales', message: err.message });
    }
}));
/* Obtener uno ────────────────────────────────── */
zipcodeRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const z = yield zipcode_model_1.Zipcode.findById(req.params.id);
        if (!z)
            return res.status(404).json({ ok: false, error: 'Código postal no encontrado' });
        res.json({ ok: true, data: { zipcode: z } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al obtener código postal', message: err.message });
    }
}));
exports.default = zipcodeRouter;
