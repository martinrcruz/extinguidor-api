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
const admin_model_1 = require("../models/admin.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const espfisicos_model_1 = require("../models/espfisicos.model");
const espacioFisicoRoutes = (0, express_1.Router)();
espacioFisicoRoutes.post('/', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administrador = yield admin_model_1.Admin.findById(req.usuario._id);
        if (!administrador) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Administrador no encontrado'
            });
        }
        const espacioFisico = new espfisicos_model_1.EspacioFisico({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            imagen: req.body.imagen,
            capacidad: req.body.capacidad,
            descripcion: req.body.descripcion,
            tipo: req.body.tipo,
            diasHorarios: req.body.diasHorarios,
            ubicacion: req.body.ubicacion,
            salas: req.body.salas,
            propietario: administrador._id,
            esPublico: req.body.esPublico
        });
        yield espacioFisico.save();
        administrador.espaciosFisicos.push(espacioFisico._id);
        yield administrador.save();
        res.json({
            ok: true,
            espacioFisico
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear el espacio físico',
            error: err
        });
    }
}));
espacioFisicoRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const espaciosFisicos = yield espfisicos_model_1.EspacioFisico.find();
        res.json({
            ok: true,
            espaciosFisicos
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener los espacios físicos',
            error: err
        });
    }
}));
espacioFisicoRoutes.get('/byAdmin/:adminId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const espaciosFisicos = yield espfisicos_model_1.EspacioFisico.find({ propietario: req.params.adminId });
        res.json({
            ok: true,
            espaciosFisicos
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener los espacios físicos del administrador',
            error: err
        });
    }
}));
espacioFisicoRoutes.get('/publicos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const espaciosFisicos = yield espfisicos_model_1.EspacioFisico.find({ esPublico: true });
        res.json({
            ok: true,
            espaciosFisicos
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener los espacios físicos públicos',
            error: err
        });
    }
}));
espacioFisicoRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const espacioFisico = yield espfisicos_model_1.EspacioFisico.findById(req.params.id);
        if (!espacioFisico) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Espacio físico no encontrado'
            });
        }
        res.json({
            ok: true,
            espacioFisico
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener el espacio físico',
            error: err
        });
    }
}));
espacioFisicoRoutes.post('/', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administrador = yield admin_model_1.Admin.findById(req.usuario._id);
        if (!administrador) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Administrador no encontrado'
            });
        }
        const espacioFisico = new espfisicos_model_1.EspacioFisico({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            pais: req.body.pais,
            provincia: req.body.provincia,
            ciudad: req.body.ciudad,
            imagen: req.body.imagen,
            capacidad: req.body.capacidad,
            descripcion: req.body.descripcion,
            tipo: req.body.tipo,
            diasHorarios: req.body.diasHorarios,
            ubicacion: req.body.ubicacion,
            salas: req.body.salas,
            propietario: administrador._id,
            esPublico: req.body.esPublico
        });
        yield espacioFisico.save();
        res.json({
            ok: true,
            espacioFisico
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear el espacio físico',
            error: err
        });
    }
}));
espacioFisicoRoutes.put('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const espacioFisico = yield espfisicos_model_1.EspacioFisico.findById(req.params.id);
        if (!espacioFisico) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Espacio físico no encontrado'
            });
        }
        if (espacioFisico.propietario.toString() !== req.usuario._id) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No tienes permiso para modificar este espacio físico'
            });
        }
        espacioFisico.nombre = req.body.nombre || espacioFisico.nombre;
        espacioFisico.direccion = req.body.direccion || espacioFisico.direccion;
        espacioFisico.imagen = req.body.imagen || espacioFisico.imagen;
        espacioFisico.capacidad = req.body.capacidad || espacioFisico.capacidad;
        espacioFisico.descripcion = req.body.descripcion || espacioFisico.descripcion;
        espacioFisico.tipo = req.body.tipo || espacioFisico.tipo;
        espacioFisico.diasHorarios = req.body.diasHorarios || espacioFisico.diasHorarios;
        espacioFisico.ubicacion = req.body.ubicacion || espacioFisico.ubicacion;
        espacioFisico.salas = req.body.salas || espacioFisico.salas;
        espacioFisico.esPublico = req.body.esPublico || espacioFisico.esPublico;
        yield espacioFisico.save();
        res.json({
            ok: true,
            espacioFisico
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar el espacio físico',
            error: err
        });
    }
}));
espacioFisicoRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const espacioFisico = yield espfisicos_model_1.EspacioFisico.findById(req.params.id);
        if (!espacioFisico) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Espacio físico no encontrado'
            });
        }
        if (espacioFisico.propietario.toString() !== req.usuario._id) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No tienes permiso para eliminar este espacio físico'
            });
        }
        yield espacioFisico.remove();
        res.json({
            ok: true,
            mensaje: 'Espacio físico eliminado exitosamente'
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar el espacio físico',
            error: err
        });
    }
}));
exports.default = espacioFisicoRoutes;
