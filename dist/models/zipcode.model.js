"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zipcode = void 0;
const mongoose_1 = require("mongoose");
const zipcodeSchema = new mongoose_1.Schema({
    name: String,
    codezip: { type: String, required: true, unique: true }
}, { versionKey: false } // elimina __v
);
exports.Zipcode = (0, mongoose_1.model)('Zipcode', zipcodeSchema);
