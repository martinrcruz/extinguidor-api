"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
const mongoose_1 = require("mongoose");
/**
 * Esquema de Mongoose para la colección "Alert"
 */
const alertSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: [true, 'El campo "message" es obligatorio']
    },
    state: {
        type: String,
        enum: ['Pendiente', 'Cerrado'],
        default: 'Pendiente'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
/**
 * Exportamos el modelo "Alert", basado en alertSchema.
 */
exports.Alert = (0, mongoose_1.model)('Alert', alertSchema);
