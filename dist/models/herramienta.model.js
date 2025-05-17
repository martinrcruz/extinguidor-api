"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herramienta = void 0;
const mongoose_1 = require("mongoose");
const herramientaSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la herramienta es requerido'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
    },
    code: {
        type: String,
        required: true,
        trim: true,
    }
    // Otros campos y validaciones según tus reglas de negocio se pueden agregar aquí
}, {
    timestamps: true
});
exports.Herramienta = (0, mongoose_1.model)('Herramienta', herramientaSchema);
