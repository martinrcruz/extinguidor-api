"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zone = void 0;
const mongoose_1 = require("mongoose");
const zoneSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    codezip: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Zipcode',
        required: [true, '']
    }
});
exports.Zone = (0, mongoose_1.model)('Zone', zoneSchema);
