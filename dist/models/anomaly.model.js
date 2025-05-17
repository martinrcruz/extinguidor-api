"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anomaly = void 0;
const mongoose_1 = require("mongoose");
const anomalySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    materials: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Solution',
            required: [true, '']
        }]
});
exports.Anomaly = (0, mongoose_1.model)('Anomaly', anomalySchema);
