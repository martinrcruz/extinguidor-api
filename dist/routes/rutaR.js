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
    try {
        const { date, name, state, vehicle, users, comentarios, encargado, herramientas } = req.body;
        // Encargado obligatorio
        if (!encargado) {
            return res.status(400).json({
                ok: false,
                error: 'Encargado es obligatorio',
                message: 'El encargado es obligatorio'
            });
        }
        // Normalizar la fecha para evitar problemas de timezone
        // Si viene como string YYYY-MM-DD, crear Date en hora local (no UTC)
        let fechaNormalizada;
        if (typeof date === 'string') {
            // Parsear como fecha local para evitar problemas de timezone
            const [year, month, day] = date.split('-').map(Number);
            fechaNormalizada = new Date(year, month - 1, day);
            fechaNormalizada.setHours(12, 0, 0, 0); // Mediodía para evitar problemas de timezone
        }
        else if (date instanceof Date) {
            fechaNormalizada = new Date(date);
        }
        else {
            return res.status(400).json({
                ok: false,
                error: 'Fecha inválida',
                message: 'La fecha debe ser un string en formato YYYY-MM-DD o un objeto Date'
            });
        }
        const rutaDB = yield rutas_model_1.Ruta.create({
            date: fechaNormalizada,
            name,
            state: state || 'Pendiente',
            vehicle: vehicle || null,
            users: users || [],
            comentarios: comentarios || '',
            encargado,
            herramientas: herramientas || []
        });
        // Estandarizar respuesta
        res.status(201).json({
            ok: true,
            data: { ruta: rutaDB }
        });
    }
    catch (err) {
        console.error('Error al crear ruta:', err);
        res.status(500).json({
            ok: false,
            error: 'Error al crear ruta',
            message: err.message || 'Error desconocido'
        });
    }
}));
//actualizar
rutaRoutes.post('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idruta = req.body._id;
        if (!idruta) {
            return res.status(400).json({
                ok: false,
                error: 'ID de ruta requerido',
                message: 'El ID de la ruta es obligatorio'
            });
        }
        if (!req.body.encargado) {
            return res.status(400).json({
                ok: false,
                error: 'Encargado es obligatorio',
                message: 'El encargado es obligatorio'
            });
        }
        // Normalizar fecha si viene en el body
        if (req.body.date && typeof req.body.date === 'string') {
            const [year, month, day] = req.body.date.split('-').map(Number);
            req.body.date = new Date(year, month - 1, day);
            req.body.date.setHours(12, 0, 0, 0);
        }
        const rutaDB = yield rutas_model_1.Ruta.findByIdAndUpdate(idruta, req.body, { new: true });
        if (!rutaDB) {
            return res.status(404).json({
                ok: false,
                error: 'Ruta no encontrada',
                message: 'Ruta no encontrada'
            });
        }
        res.status(200).json({
            ok: true,
            data: { ruta: rutaDB }
        });
    }
    catch (err) {
        console.error('Error al actualizar ruta:', err);
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar la ruta',
            message: err.message || 'Error desconocido'
        });
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
            .sort({ _id: -1 }) // Orden descendente por fecha de creación
            .exec();
        res.json({
            ok: true,
            data: { rutas }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener rutas del trabajador',
            message: error.message
        });
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
            .sort({ _id: -1 }) // Orden descendente por fecha de creación
            .exec();
        // 4) En tu proyecto, "disponibles" podría tener más lógica,
        //    ej. no asignadas a un vehículo, etc. Ajusta si corresponde.
        res.json({
            ok: true,
            data: { rutas: rutasDisponibles }
        });
    }
    catch (err) {
        console.error('Error GET /rutas/disponibles =>', err);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener rutas disponibles',
            message: err.message || 'Error desconocido'
        });
    }
}));
rutaRoutes.get('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ruta = yield rutas_model_1.Ruta.findById(id).populate('vehicle').populate('users').populate('name');
        if (ruta) {
            res.json({
                ok: true,
                data: { ruta }
            });
        }
        else {
            res.status(404).json({
                ok: false,
                error: 'Ruta no encontrada',
                message: 'Ruta no encontrada'
            });
        }
    }
    catch (error) {
        console.error('Error al obtener ruta:', error);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener la ruta',
            message: error.message || 'Error desconocido'
        });
    }
}));
rutaRoutes.get('/', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eliminado = false;
    try {
        const rutas = yield rutas_model_1.Ruta.find({ eliminado: eliminado })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .sort({ _id: -1 }); // Orden descendente por fecha de creación
        res.json({
            ok: true,
            data: { rutas }
        });
    }
    catch (error) {
        console.error('Error al obtener rutas:', error);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener los rutas',
            message: error.message || 'Error desconocido'
        });
    }
}));
// Este endpoint está duplicado, se mantiene el de abajo /fecha/:fecha
/**
 * GET /rutas/fecha/:fecha
 * Devuelve las rutas asignadas a esa fecha.
 * Formato de fecha: 'YYYY-MM-DD'
 */
rutaRoutes.get('/fecha/:fecha', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fechaParam = req.params.fecha; // "2025-04-10"
    try {
        // Parsear fecha como fecha local para evitar problemas de timezone
        const [year, month, day] = fechaParam.split('-').map(Number);
        const start = new Date(year, month - 1, day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(year, month - 1, day);
        end.setHours(23, 59, 59, 999);
        const rutas = yield rutas_model_1.Ruta.find({
            date: { $gte: start, $lte: end },
            eliminado: false
        })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .sort({ _id: -1 })
            .exec();
        res.json({
            ok: true,
            data: { rutas }
        });
    }
    catch (err) {
        console.error('Error /rutas/fecha/:fecha', err);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener rutas por fecha',
            message: err.message || 'Error desconocido'
        });
    }
}));
// Este endpoint está duplicado con /create, se elimina para evitar confusión
/**
 * GET /rutas/:rutaId/partes
 * Devuelve los partes asociados a la ruta con _id = :rutaId
 */
rutaRoutes.get('/:rutaId/partes', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rutaId = req.params.rutaId;
    try {
        const partes = yield parte_model_1.Parte.find({ ruta: rutaId })
            .populate('customer')
            .sort({ createdDate: -1 }) // Orden descendente por fecha de creación
            .exec();
        res.json({
            ok: true,
            data: { partes }
        });
    }
    catch (err) {
        console.error(`Error GET /rutas/${rutaId}/partes`, err);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener partes de la ruta',
            message: err.message || 'Error desconocido'
        });
    }
}));
/**
 * POST /rutas/:id/asignarPartes
 * Body: { parteIds: string[] }
 * Asigna esos partes a la ruta, marcando asignado = true y ruta = :id
 */
rutaRoutes.post('/:id/asignarPartes', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rutaId = req.params.id;
        const { parteIds } = req.body; // array de IDs
        if (!parteIds || !Array.isArray(parteIds)) {
            return res.status(400).json({
                ok: false,
                error: 'parteIds debe ser un array',
                message: 'parteIds debe ser un array de IDs'
            });
        }
        // Verificar que la ruta existe
        const ruta = yield rutas_model_1.Ruta.findById(rutaId);
        if (!ruta) {
            return res.status(404).json({
                ok: false,
                error: 'Ruta no encontrada',
                message: 'La ruta especificada no existe'
            });
        }
        // Actualizar partes
        const result = yield parte_model_1.Parte.updateMany({ _id: { $in: parteIds } }, { $set: { asignado: true, ruta: rutaId } });
        res.json({
            ok: true,
            data: {
                message: 'Partes asignados a la ruta',
                partesActualizados: result.modifiedCount
            }
        });
    }
    catch (err) {
        console.error('Error /rutas/:id/asignarPartes', err);
        res.status(500).json({
            ok: false,
            error: 'Error al asignar partes a la ruta',
            message: err.message || 'Error desconocido'
        });
    }
}));
/**
 * GET /rutas/porFecha/:fecha
 * Devuelve todas las rutas cuya fecha (date) esté entre el inicio y fin del día indicado.
 * Formato de fecha: "YYYY-MM-DD"
 */
rutaRoutes.get('/porFecha/:fecha', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.params; // Ejemplo: "2025-02-23"
    try {
        // Parsear fecha como fecha local para evitar problemas de timezone
        const [year, month, day] = fecha.split('-').map(Number);
        const start = new Date(year, month - 1, day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(year, month - 1, day);
        end.setHours(23, 59, 59, 999);
        // Buscar todas las rutas cuya fecha esté entre start y end
        const rutas = yield rutas_model_1.Ruta.find({
            date: { $gte: start, $lte: end },
            eliminado: false
        })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .sort({ _id: -1 }) // Orden descendente por fecha de creación
            .exec();
        res.json({
            ok: true,
            data: { rutas }
        });
    }
    catch (err) {
        console.error('Error GET /rutas/porFecha/:fecha =>', err);
        res.status(500).json({
            ok: false,
            error: 'Error al obtener rutas por fecha',
            message: err.message || 'Error desconocido'
        });
    }
}));
/**
 * DELETE /rutas/:id
 * Elimina una ruta específica por ID
 */
rutaRoutes.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rutaId = req.params.id;
        // Opción 1: Eliminación lógica (cambiar eliminado a true)
        const rutaUpdated = yield rutas_model_1.Ruta.findByIdAndUpdate(rutaId, { eliminado: true }, { new: true });
        if (!rutaUpdated) {
            return res.status(404).json({
                ok: false,
                message: 'Ruta no encontrada'
            });
        }
        res.json({
            ok: true,
            data: {
                message: 'Ruta eliminada correctamente',
                ruta: rutaUpdated
            }
        });
    }
    catch (err) {
        console.error('Error al eliminar ruta =>', err);
        res.status(500).json({
            ok: false,
            error: 'Error al eliminar ruta',
            message: err.message || 'Error desconocido'
        });
    }
}));
exports.default = rutaRoutes;
