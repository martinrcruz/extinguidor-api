"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ruta = void 0;
const mongoose_1 = require("mongoose");
const rutasSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'RutaN',
        required: [true, '']
    },
    state: {
        type: String,
        enum: ["Pendiente", "EnProceso", "Finalizado"],
        default: "Pendiente"
    },
    date: {
        type: Date,
    },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
    vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vehicle',
        default: null
    },
    eliminado: {
        type: Boolean,
        default: false
    },
    // NUEVOS CAMPOS
    comentarios: {
        type: String,
        default: ''
    },
    encargado: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false // si es obligatorio en la lógica, lo controlas en endpoint
    },
    herramientas: [{
            type: String // o array de ObjectId si lo gestionas en otra coleccion
        }]
});
exports.Ruta = (0, mongoose_1.model)('Ruta', rutasSchema);
