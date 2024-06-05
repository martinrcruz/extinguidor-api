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
const autenticacion_1 = require("../middlewares/autenticacion");
const parte_model_1 = require("../models/parte.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const documentsParte_model_1 = require("../models/documentsParte.model");
const parteRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
parteRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
parteRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parte = req.body;
    const programado = Number(req.body.programado);
    const duracion = Number(1) * 12;
    const documentsParte = req.body.docs;
    let suma = 0;
    const repetir = req.body.periodicos;
    if (repetir) {
        try {
            let fechaActual = new Date(parte.date);
            let partesGuardadas = [];
            const nuevoParte = Object.assign(Object.assign({}, parte), { date: new Date(fechaActual) });
            const parteDB = yield parte_model_1.Parte.create(nuevoParte);
            if (documentsParte) {
                for (let i = 0; i < documentsParte.length; i++) {
                    const nuevoDoc = Object.assign(Object.assign({}, documentsParte[i]), { parte: parteDB._id });
                    const documentsparteDB = yield documentsParte_model_1.DocumentParte.create(nuevoDoc);
                }
            }
            partesGuardadas.push(parteDB);
            while (suma < duracion) {
                fechaActual.setMonth(fechaActual.getMonth() + programado);
                const nuevoParte = Object.assign(Object.assign({}, parte), { date: new Date(fechaActual) });
                const parteDB = yield parte_model_1.Parte.create(nuevoParte);
                if (documentsParte) {
                    for (let i = 0; i < documentsParte.length; i++) {
                        const nuevoDoc = Object.assign(Object.assign({}, documentsParte[i]), { parte: parteDB._id });
                        //    const documentsparteDB = await DocumentParte.create(nuevoDoc);
                    }
                }
                partesGuardadas.push(parteDB);
                suma = suma + programado;
            }
            if (suma >= duracion) {
                res.status(201).json({
                    ok: true,
                    partes: partesGuardadas,
                });
            }
        }
        catch (err) {
            res.status(500).json({ message: 'Error al crear partes  1', err });
        }
    }
    else {
        try {
            const parteDB = yield parte_model_1.Parte.create(parte);
            if (documentsParte) {
                for (let i = 0; i < documentsParte.length; i++) {
                    const nuevoDoc = Object.assign(Object.assign({}, documentsParte[i]), { parte: parteDB._id });
                    const documentsparteDB = yield documentsParte_model_1.DocumentParte.create(nuevoDoc);
                }
            }
            res.status(201).json({
                ok: true,
                parte: parteDB
            });
        }
        catch (err) {
            res.status(500).json({ message: 'Error al crear parte', err });
        }
    }
}));
//actualizar
parteRoutes.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idparte = req.body._id;
    const updatedParteData = req.body;
    console.log(updatedParteData);
    try {
        const parteDB = yield parte_model_1.Parte.findByIdAndUpdate(idparte, updatedParteData, { new: true });
        if (!parteDB) {
            return res.status(404).json({ message: 'Parte no encontrada' });
        }
        res.status(200).json({
            ok: true,
            parte: parteDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al actualizar la parte', err });
    }
}));
parteRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
parteRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partes = yield parte_model_1.Parte.find().populate('customer').populate('zone').populate('ruta');
        res.json({
            ok: true,
            partes: partes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/cotrato/:contrato', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contrato = req.params.contrato;
    try {
        const partes = yield parte_model_1.Parte.find({ customer: contrato }).populate('ruta').populate('zone');
        res.json({
            ok: true,
            partes: partes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
parteRoutes.get('/ruta/:ruta', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.params.ruta;
    try {
        const partes = yield parte_model_1.Parte.find({ ruta: ruta }).populate('customer').populate('zone');
        res.json({
            ok: true,
            partes: partes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
parteRoutes.get('/noasignados/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaInicio = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaInicio.getDate() + 30);
    fechaInicio.setDate(fechaInicio.getDate() - 360);
    const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}`;
    const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}`;
    const asignado = false;
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: asignado,
            date: {
                $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).populate('customer').populate('zone');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/noasignado/:fecha', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = new Date(req.params.fecha);
    const fechaInicio = new Date();
    const noasignado = false;
    fechaInicio.setDate(fecha.getDate() - 365);
    const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}`;
    const formattedEndDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    console.log(fecha);
    console.log(formattedEndDate);
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: noasignado,
            date: {
                $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).populate('customer').populate('zone');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/asignado/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaInicio = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaInicio.getDate() - 1);
    const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;
    const asignado = true;
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: asignado,
            date: {
                // $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).populate('customer').populate('zone').populate('ruta');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
parteRoutes.get('/nofin/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaInicio = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaInicio.getDate() - 1);
    const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;
    const asignado = true;
    try {
        const partes = yield parte_model_1.Parte.find({
            asignado: asignado,
            state: { $ne: 'Finalizado' },
            date: {
                // $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).populate('customer').populate('zone').populate('ruta');
        res.json({
            ok: true,
            partes: partes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los partes', error });
    }
}));
//subir archivos
parteRoutes.post('/upload', [autenticacion_1.verificarToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha subido ningun archivo!!!'
        });
    }
    const file = req.files.archivo;
    if (!file) {
        return res.status(400).json({
            ok: false,
            file: req.file,
            msg: 'No se ha subido ningun archivo2'
        });
    }
    const carpeta = 'partes';
    const nombres = yield fileSystem.guardarFileTemp(file, carpeta, req.user._id);
    return res.json({
        ok: true,
        nombres: nombres
    });
}));
exports.default = parteRoutes;
