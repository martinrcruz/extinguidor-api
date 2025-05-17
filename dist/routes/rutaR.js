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
const rutas_model_1 = require("../models/rutas.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const parte_model_1 = require("../models/parte.model");
const date_fns_1 = require("date-fns");
const rutaRoutes = (0, express_1.Router)();
rutaRoutes.get('/prueba', autenticacion_1.verificarToken, (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
rutaRoutes.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ruta = req.body;
    console.log(ruta);
    try {
        const { date, name, state, vehicle, users, comentarios, encargado, herramientas } = req.body;
        console.log(date);
        // Encargado obligatorio
        if (!encargado) {
            return res.status(400).json({
                ok: false,
                message: 'Encargado es obligatorio'
            });
        }
        const rutaDB = yield rutas_model_1.Ruta.create({
            date,
            name,
            state: state || 'Pendiente',
            vehicle: vehicle || null,
            users: users || [],
            comentarios: comentarios || '',
            encargado,
            herramientas: herramientas || []
        });
        res.status(201).json({ ok: true, ruta: rutaDB });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al crear ruta', err });
    }
}));
//actializar
rutaRoutes.post('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedRutaData = req.body;
    console.log(updatedRutaData);
    try {
        const idruta = req.body._id;
        if (!req.body.encargado) {
            return res.status(400).json({
                ok: false,
                message: 'Encargado es obligatorio'
            });
        }
        const updatedRutaData = req.body;
        const rutaDB = yield rutas_model_1.Ruta.findByIdAndUpdate(idruta, updatedRutaData, { new: true });
        if (!rutaDB) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        res.status(200).json({ ok: true, ruta: rutaDB });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al actualizar la ruta', err });
    }
}));
/**
 * GET /rutas/worker/:workerId
 * Obtiene las rutas asignadas a un trabajador específico
 */
rutaRoutes.get('/worker/:workerId', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId } = req.params;
        const dateStr = req.query.date;
        let query = { users: workerId };
        if (dateStr) {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ ok: false, error: 'Fecha inválida' });
            }
            const start = (0, date_fns_1.startOfMonth)(date);
            const end = (0, date_fns_1.endOfMonth)(date);
            query.date = { $gte: start, $lte: end };
        }
        const rutas = yield rutas_model_1.Ruta.find(query)
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .exec();
        res.json({ ok: true, rutas });
    }
    catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
}));
rutaRoutes.get('/disponibles', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) Tomar query param date=YYYY-MM-DD, o por defecto la fecha actual
        const dateStr = req.query.date;
        let baseDate;
        if (dateStr) {
            baseDate = new Date(dateStr);
            if (isNaN(baseDate.getTime())) {
                return res.status(400).json({ ok: false, message: 'date inválido' });
            }
        }
        else {
            baseDate = new Date(); // hoy
        }
        // 2) Calcular inicio y fin de mes con date-fns
        const start = (0, date_fns_1.startOfMonth)(baseDate);
        const end = (0, date_fns_1.endOfMonth)(baseDate);
        // 3) Buscar rutas en ese rango
        const rutasDisponibles = yield rutas_model_1.Ruta.find({
            date: { $gte: start, $lte: end },
            eliminado: false
        })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .exec();
        // 4) En tu proyecto, "disponibles" podría tener más lógica,
        //    ej. no asignadas a un vehículo, etc. Ajusta si corresponde.
        res.json({
            ok: true,
            rutas: rutasDisponibles
        });
    }
    catch (err) {
        console.error('Error GET /rutas/disponibles =>', err);
        res.status(500).json({ ok: false, err });
    }
}));
rutaRoutes.get('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ruta = yield rutas_model_1.Ruta.findById(id).populate('vehicle').populate('users').populate('name');
        if (ruta) {
            res.json({
                ok: true,
                ruta: ruta
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
rutaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eliminado = false;
    try {
        const rutas = yield rutas_model_1.Ruta.find({ eliminado: eliminado }).populate('vehicle').populate('users').populate('name');
        res.json({
            ok: true,
            rutas: rutas
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
rutaRoutes.get('/fecha/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.params.date;
    const eliminado = false;
    try {
        const rutas = yield rutas_model_1.Ruta.find({ date: date }, { eliminado: eliminado }).populate('users').populate('vehicle').populate('name');
        res.json({
            ok: true,
            rutas: rutas
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los rutas', error });
    }
}));
/**
 * GET /rutas/fecha/:fecha
 * Devuelve la ruta asignada a esa fecha (si existe).
 * Formato de fecha: 'YYYY-MM-DD'
 */
rutaRoutes.get('/fecha/:fecha', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaParam = req.params.fecha; // "2025-04-10"
    try {
        // Si permites solo 1 ruta al día, usas findOne.
        // Si permites múltiples rutas, usas find.
        const ruta = yield rutas_model_1.Ruta.findOne({ date: fechaParam })
            .populate('vehicle')
            .populate('users')
            .populate('name') // si name es un objectId a RutaN, etc.
            .exec();
        if (!ruta) {
            return res.json({ ok: false, message: 'No hay ruta para esa fecha' });
        }
        res.json({ ok: true, ruta });
    }
    catch (err) {
        console.error('Error /rutas/fecha/:fecha', err);
        res.status(500).json({ ok: false, err });
    }
}));
/**
 * POST /rutas
 * Crea una nueva ruta (date, etc.).
 * Body esperado: { date, name, type, vehicle, users }
 */
rutaRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, name, type, vehicle, users } = req.body;
        // Creamos la nueva ruta
        const nuevaRuta = yield rutas_model_1.Ruta.create({
            date,
            name,
            type,
            vehicle,
            users
        });
        res.json({ ok: true, ruta: nuevaRuta });
    }
    catch (err) {
        console.error('Error POST /rutas', err);
        res.status(500).json({ ok: false, err });
    }
}));
/**
 * GET /rutas/:rutaId/partes
 * Devuelve los partes asociados a la ruta con _id = :rutaId
 */
rutaRoutes.get('/:rutaId/partes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rutaId = req.params.rutaId;
    try {
        const partes = yield parte_model_1.Parte.find({ ruta: rutaId }).exec();
        res.json({ ok: true, partes });
    }
    catch (err) {
        console.error(`Error GET /rutas/${rutaId}/partes`, err);
        res.status(500).json({ ok: false, err });
    }
}));
/**
 * POST /rutas/:id/asignarPartes
 * Body: { parteIds: string[] }
 * Asigna esos partes a la ruta, marcando asignado = true y ruta = :id
 */
rutaRoutes.post('/:id/asignarPartes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rutaId = req.params.id;
        const { parteIds } = req.body; // array de IDs
        if (!parteIds || !Array.isArray(parteIds)) {
            return res.status(400).json({ ok: false, message: 'parteIds debe ser array' });
        }
        // Actualizar
        yield parte_model_1.Parte.updateMany({ _id: { $in: parteIds } }, { $set: { asignado: true, ruta: rutaId } });
        res.json({ ok: true, message: 'Partes asignados a la ruta' });
    }
    catch (err) {
        console.error('Error /rutas/:id/asignarPartes', err);
        res.status(500).json({ ok: false, err });
    }
}));
/**
 * GET /rutas/porFecha/:fecha
 * Devuelve todas las rutas cuya fecha (date) esté entre el inicio y fin del día indicado.
 * Formato de fecha: "YYYY-MM-DD"
 */
rutaRoutes.get('/porFecha/:fecha', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.params; // Ejemplo: "2025-02-23"
    try {
        // Convertir el parámetro en un rango UTC para abarcar todo el día
        const start = new Date(fecha + 'T00:00:00.000Z');
        const end = new Date(fecha + 'T23:59:59.999Z');
        // Buscar todas las rutas cuya fecha esté entre start y end
        const rutas = yield rutas_model_1.Ruta.find({
            date: { $gte: start, $lte: end },
            eliminado: false
        })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .exec();
        res.json({ ok: true, rutas });
    }
    catch (err) {
        console.error('Error GET /rutas/porFecha/:fecha =>', err);
        res.status(500).json({ ok: false, err });
    }
}));
exports.default = rutaRoutes;
