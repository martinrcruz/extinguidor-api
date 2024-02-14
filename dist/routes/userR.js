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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
userRoutes.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    user.password = yield bcrypt_1.default.hashSync(req.body.password, 10);
    try {
        const userDB = yield user_model_1.User.create(user);
        res.status(201).json({
            ok: true,
            mje: 'user creado'
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }).select('+password').then(userDB => {
        if (!userDB) {
            return res.status(500).json({
                ok: false,
                message: 'usuario no encontrado'
            });
        }
        if (userDB === null || userDB === void 0 ? void 0 : userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                code: userDB.code,
                email: userDB.email,
                phone: userDB.phone,
                role: userDB.role,
                junior: userDB.junior
            });
            res.status(201).json({
                ok: true,
                tokenU: tokenUser,
                role: userDB.role
            });
        }
        else {
            res.status(500).json({
                ok: false,
                message: 'password no coincide'
            });
        }
    }).catch(err => {
        res.status(500).json({ message: 'Error', err });
    });
});
//actializar
userRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    console.log(req.user._id);
    const datosActualizados = req.body;
    if (req.body.password) {
        datosActualizados.password = bcrypt_1.default.hashSync(req.body.password, 10);
    }
    try {
        const userActualizado = yield user_model_1.User.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (userActualizado) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userActualizado._id,
                name: userActualizado.name,
                code: userActualizado.code,
                email: userActualizado.email,
                phone: userActualizado.phone,
                role: userActualizado.role,
                junior: userActualizado.junior
            });
            res.status(201).json({
                ok: true,
                tokenU: tokenUser
            });
        }
        else {
            res.status(404).json({ message: 'no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el evento', error });
    }
}));
// Ruta para eliminar un user por su ID
//obtener users
userRoutes.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find();
        res.json({
            ok: true,
            users: users
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los users', error });
    }
}));
//obtener users
userRoutes.get('/worker', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find({ role: 'worker' });
        res.json({
            ok: true,
            users: users
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los users', error });
    }
}));
// Ruta para obtener un user
userRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_model_1.User.findById(id);
        if (user) {
            res.json({
                ok: true,
                user: user
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
userRoutes.get('/', [autenticacion_1.verificarToken], (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});
exports.default = userRoutes;
