"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comentario: {
        type: String,
        required: [true, 'comentario'],
        unique: true
    },
    date: {
        type: Date,
        require: [true, '']
    },
    parte: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parte',
        required: [true, '']
    },
    lat: {},
    lgn: {},
    fotos: []
});
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
