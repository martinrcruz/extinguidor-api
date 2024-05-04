"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentParte = void 0;
const mongoose_1 = require("mongoose");
const documentParteSchema = new mongoose_1.Schema({
    parte: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parte',
        required: [true, 'no se encontro parte']
    },
    detalle: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    url: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    date: {
        type: Date,
        required: [true, 'la fecha es requerida']
    },
});
exports.DocumentParte = (0, mongoose_1.model)('DocumentParte', documentParteSchema);
