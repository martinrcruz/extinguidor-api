"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
const mongoose_1 = require("mongoose");
const materialSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        unique: true
    },
    code: {
        type: String,
        required: [true, "code is required"],
        unique: true
    },
    description: {
        type: String
    },
    type: {
        type: String
    }
});
exports.Material = (0, mongoose_1.model)('Material', materialSchema);
