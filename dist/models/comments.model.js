"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    date: {
        type: Date,
        require: [true, '']
    },
    report: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Report',
        required: [true, '']
    }
});
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
