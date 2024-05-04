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
const autenticacion_1 = require("../middlewares/autenticacion");
const rutaN_model_1 = require("../models/rutaN.model");
const rutaNRoutes = (0, express_1.Router)();
rutaNRoutes.get('/prueba', autenticacion_1.verificarToken, (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
rutaNRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.body;
    console.log(ruta);
    try {
        const rutaDB = yield rutaN_model_1.RutaN.create(ruta);
        res.status(201).json({
            ok: true,
            ruta: rutaDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
rutaNRoutes.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Ruta por su ID
rutaNRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const rutaN = yield rutaN_model_1.RutaN.findById(id);
        if (rutaN) {
            res.json({
                ok: true,
                ruta: rutaN
            });
        }
        else {
            res.status(404).json({ message: 'ruta no encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
}));
rutaNRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rutas = yield rutaN_model_1.RutaN.find();
        res.json({
            ok: true,
            rutas: rutas
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
exports.default = rutaNRoutes;
