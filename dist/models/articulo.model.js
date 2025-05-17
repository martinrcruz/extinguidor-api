"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articuloSchema = new mongoose_1.Schema({
    cantidad: {
        type: Number,
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    grupo: {
        type: String,
        required: true
    },
    familia: {
        type: String,
        required: true
    },
    descripcionArticulo: {
        type: String,
        required: true
    },
    precioVenta: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    eliminado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    }
});
exports.default = (0, mongoose_1.model)('Articulo', articuloSchema);
