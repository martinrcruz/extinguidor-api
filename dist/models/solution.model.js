"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solution = void 0;
const mongoose_1 = require("mongoose");
const solutionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    description: {
        type: String,
    },
    materials: [{
            material: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Material',
                required: [true, 'no se encontro usuario']
            },
            qty: {
                type: Number
            }
        }]
});
exports.Solution = (0, mongoose_1.model)('Solution', solutionSchema);
