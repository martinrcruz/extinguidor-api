"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RutaN = void 0;
const mongoose_1 = require("mongoose");
const rutaNSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
});
exports.RutaN = (0, mongoose_1.model)('RutaN', rutaNSchema);
