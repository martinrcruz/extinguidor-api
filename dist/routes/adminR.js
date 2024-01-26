"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_model_1 = require("../models/admin.model");
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const adminRoutes = (0, express_1.Router)();
adminRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'todo ok'
    });
});
adminRoutes.post('/create', (req, res) => {
    // Extraer información
    const admin = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        celular: req.body.celular,
        pais: req.body.pais,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        espaciosFisicos: req.body.espaciosFisicos
    };
    admin_model_1.Admin.create(admin).then(adminDB => {
        // Respuesta
        const tokenAdmin = token_1.default.getJwtToken({
            _id: adminDB._id,
            nombre: adminDB.nombre,
            apellido: adminDB.apellido,
            email: adminDB.email,
            celular: adminDB.celular,
            pais: adminDB.pais,
            provincia: adminDB.provincia,
            ciudad: adminDB.ciudad,
            espaciosFisicos: adminDB.espaciosFisicos
        });
        res.json({
            ok: true,
            token: tokenAdmin
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
adminRoutes.post('/login', (req, res) => {
    const body = req.body;
    admin_model_1.Admin.findOne({ email: body.email }).then(adminDB => {
        if (!adminDB) {
            return res.json({
                ok: false,
                mensaje: 'El admin no existe'
            });
        }
        if (adminDB.compararPassword(body.password)) {
            const tokenAdmin = token_1.default.getJwtToken({
                _id: adminDB._id,
                nombre: adminDB.nombre,
                apellido: adminDB.apellido,
                email: adminDB.email,
                celular: adminDB.celular,
                pais: adminDB.pais,
                provincia: adminDB.provincia,
                ciudad: adminDB.ciudad,
                espaciosFisicos: adminDB.espaciosFisicos
            });
            res.json({
                ok: true,
                token: tokenAdmin
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'La contraseña no es correcta'
            });
        }
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
adminRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => {
    const admin = {
        nombre: req.body.nombre || req.admin.nombre,
        apellido: req.body.apellido || req.admin.apellido,
        email: req.body.email || req.admin.email,
        celular: req.body.celular || req.admin.celular,
        pais: req.body.pais || req.admin.pais,
        provincia: req.body.provincia || req.admin.provincia,
        ciudad: req.body.ciudad || req.admin.ciudad,
        espaciosFisicos: req.body.espaciosFisicos || req.admin.espaciosFisicos
    };
    admin_model_1.Admin.findByIdAndUpdate(req.admin._id, admin, { new: true })
        .then((adminDB) => {
        if (!adminDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe el admin'
            });
        }
        const tokenAdmin = token_1.default.getJwtToken({
            _id: adminDB._id,
            nombre: adminDB.nombre,
            apellido: adminDB.apellido,
            email: adminDB.email,
            celular: adminDB.celular,
            pais: adminDB.pais,
            provincia: adminDB.provincia,
            ciudad: adminDB.ciudad,
            espaciosFisicos: adminDB.espaciosFisicos
        });
        res.json({
            ok: true,
            token: tokenAdmin
        });
    })
        .catch((err) => {
        if (err)
            throw err;
    });
});
adminRoutes.put('/updatePassword', autenticacion_1.verificarToken, (req, res) => {
    const admin = {
        password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
    admin_model_1.Admin.findByIdAndUpdate(req.admin._id, admin, { new: true })
        .then((adminDB) => {
        if (!adminDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe el admin'
            });
        }
        const tokenAdmin = token_1.default.getJwtToken({
            _id: adminDB._id,
            nombre: adminDB.nombre,
            apellido: adminDB.apellido,
            email: adminDB.email,
            celular: adminDB.celular,
            pais: adminDB.pais,
            provincia: adminDB.provincia,
            ciudad: adminDB.ciudad,
            espaciosFisicos: adminDB.espaciosFisicos
        });
        res.json({
            ok: true,
            token: tokenAdmin
        });
    })
        .catch((err) => {
        if (err)
            throw err;
    });
});
adminRoutes.get('/', autenticacion_1.verificarToken, (req, res) => {
    const admin = req.admin;
    res.json({
        ok: true,
        admin
    });
});
exports.default = adminRoutes;
