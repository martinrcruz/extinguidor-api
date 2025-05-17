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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = (0, express_1.Router)();
/* ============= CHECK SERVER STATUS ============= */
userRoutes.get('/check-status', (_req, res) => {
    res.json({ ok: true, data: { status: 'online', message: 'Server running correctly' } });
});
/* ============= CREATE ============= */
userRoutes.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = Object.assign(Object.assign({}, req.body), { password: bcrypt_1.default.hashSync(req.body.password, 10) });
        const userDB = yield user_model_1.User.create(body);
        // devolvemos el documento recién creado
        res.status(201).json({ ok: true, data: { user: userDB } });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'Error al crear usuario', message: err.message });
    }
}));
/* ============= LOGIN ============= */
userRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userDB = yield user_model_1.User.findOne({ email }).select('+password');
    if (!userDB)
        return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    if (!userDB.compararPassword(password))
        return res.status(400).json({ ok: false, error: 'Contraseña incorrecta' });
    const token = token_1.default.getJwtToken({
        _id: userDB._id,
        name: userDB.name,
        code: userDB.code,
        email: userDB.email,
        phone: userDB.phone,
        role: userDB.role
    });
    res.json({ ok: true, data: { token, role: userDB.role } });
}));
/* ============= UPDATE ============= */
userRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { _id } = _a, rest = __rest(_a, ["_id"]);
    const updatePayload = Object.assign({}, rest);
    // evita colisión de e-mail
    if (updatePayload.email) {
        const dup = yield user_model_1.User.findOne({ email: updatePayload.email, _id: { $ne: _id } });
        if (dup)
            return res.status(400).json({ ok: false, error: 'Email ya está en uso' });
    }
    const updated = yield user_model_1.User.findByIdAndUpdate(_id, updatePayload, { new: true });
    if (!updated)
        return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    const newToken = token_1.default.getJwtToken({
        _id: updated._id,
        name: updated.name,
        code: updated.code,
        email: updated.email,
        phone: updated.phone,
        role: updated.role
    });
    res.json({ ok: true, data: { user: updated, token: newToken } });
}));
/* ============= DELETE ============= */
userRoutes.delete('/delete/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const removed = yield user_model_1.User.findByIdAndDelete(id);
    if (!removed)
        return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: { message: 'Usuario eliminado' } });
}));
/* ============= READ ============= */
userRoutes.get('/list', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    res.json({ ok: true, data: { users } });
}));
userRoutes.get('/worker', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: 'worker' });
    res.json({ ok: true, data: { users } });
}));
userRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.params.id);
    if (!user)
        return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: { user } });
}));
/* ========= logged-in profile ======= */
userRoutes.get('/', autenticacion_1.verificarToken, (req, res) => {
    res.json({ ok: true, data: { user: req.user } });
});
exports.default = userRoutes;
