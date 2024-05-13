"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'nombre de usuario requerido']
    },
    code: {
        type: String,
        unique: true,
        required: [true, '']
    },
    photo: {
        type: String,
        quired: [true, ''],
        default: "https://ionicframework.com/docs/img/demos/avatar.svg"
    },
    role: {
        type: String,
        enum: ["worker", "admin"],
        required: [true, ''],
    },
    email: {
        type: String,
        unique: [true, 'email ya registrado'],
        required: [true, 'Ingresa un email válido']
    },
    phone: {
        type: String,
        unique: [true, 'numero ya registrado'],
        required: [true, 'El número es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'Ingresa una contraseña'],
        select: false
    },
    activo: {
        type: Boolean,
        default: true,
        required: [true, 'Usuario no autorizado']
    },
    junior: {
        type: Boolean,
        default: true,
        required: [true, 'el usuario es junior']
    },
});
userSchema.methods.compararPassword = function (password) {
    return bcrypt_1.default.compareSync(password, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
