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
exports.verificarPropietarioParte = void 0;
const parte_model_1 = require("../models/parte.model");
const rutas_model_1 = require("../models/rutas.model");
const user_model_1 = require("../models/user.model");
const verificarPropietarioParte = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parteId = req.params.id;
        const userId = req.usuario._id;
        // Verificar si el usuario está activo
        const user = yield user_model_1.User.findById(userId);
        if (!user || !user.activo) {
            return res.status(403).json({
                ok: false,
                error: 'Usuario inactivo o no encontrado'
            });
        }
        // Verificar si el usuario tiene permisos de administrador
        if (user.role === 'admin') {
            return next();
        }
        const parte = yield parte_model_1.Parte.findById(parteId);
        if (!parte) {
            return res.status(404).json({
                ok: false,
                error: 'Parte no encontrado'
            });
        }
        // Si el parte no tiene ruta asignada, solo los administradores pueden modificarlo
        if (!parte.ruta) {
            return res.status(403).json({
                ok: false,
                error: 'Solo los administradores pueden modificar partes sin ruta asignada'
            });
        }
        // Verificar que el parte pertenece a una ruta del usuario
        const ruta = yield rutas_model_1.Ruta.findOne({
            _id: parte.ruta,
            users: userId,
            active: true
        });
        if (!ruta) {
            return res.status(403).json({
                ok: false,
                error: 'No autorizado para modificar este parte'
            });
        }
        // Verificar si el usuario tiene permisos específicos para la ruta
        const userRuta = (_a = ruta.users) === null || _a === void 0 ? void 0 : _a.find(u => u.toString() === userId.toString());
        if (!userRuta) {
            return res.status(403).json({
                ok: false,
                error: 'No tienes permisos para esta ruta'
            });
        }
        // Agregar información útil al request
        req.parte = parte;
        req.ruta = ruta;
        next();
    }
    catch (error) {
        console.error('Error en verificarPropietarioParte:', error);
        res.status(500).json({
            ok: false,
            error: 'Error al verificar permisos del parte'
        });
    }
});
exports.verificarPropietarioParte = verificarPropietarioParte;
