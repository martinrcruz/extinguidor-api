"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parte = void 0;
const mongoose_1 = require("mongoose");
const parteSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: [true, 'name is required'],
    },
    state: {
        type: String,
        enum: ["Pendiente", "EnProceso", "Finalizado"],
        required: [true, ''],
        default: "Pendiente"
    },
    type: {
        type: String,
        enum: ["Instalacion", "Mantenimiento", "Reparacion"],
        required: [true, ''],
    },
    asignado: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
    },
    code: {
        type: String,
        // required: [true, 'code is required'],
        // unique: true
    },
    zone: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Zone',
        required: [true, '']
    },
    ruta: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Ruta',
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, '']
    }
});
exports.Parte = (0, mongoose_1.model)('Parte', parteSchema);
