"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialParte = void 0;
const mongoose_1 = require("mongoose");
const materialParteSchema = new mongoose_1.Schema({
    ruta: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Ruta',
        required: [true, 'no se encontro parte']
    },
    material: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, 'no se encontro parte']
    },
    cantidad: {
        type: String,
        required: [true, "code is required"],
        unique: true
    },
});
exports.MaterialParte = (0, mongoose_1.model)('MaterialParte', materialParteSchema);
