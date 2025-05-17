"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articulo_model_1 = __importDefault(require("../models/articulo.model"));
const autenticacion_1 = require("../middlewares/autenticacion");
const router = (0, express_1.Router)();
// Obtener todos los artículos
router.get('/', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articulos = yield articulo_model_1.default.find({ eliminado: false });
        res.json({
            ok: true,
            articulos
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}));
// Obtener un artículo por ID
router.get('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articulo = yield articulo_model_1.default.findOne({ _id: req.params.id, eliminado: false });
        if (!articulo) {
            return res.status(404).json({
                ok: false,
                msg: 'Artículo no encontrado'
            });
        }
        res.json({
            ok: true,
            articulo
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}));
// Crear un nuevo artículo
router.post('/', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articulo = new articulo_model_1.default(req.body);
        yield articulo.save();
        res.json({
            ok: true,
            articulo
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}));
// Actualizar un artículo
router.put('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articulo = yield articulo_model_1.default.findOneAndUpdate({ _id: req.params.id, eliminado: false }, Object.assign(Object.assign({}, req.body), { updatedDate: new Date() }), { new: true });
        if (!articulo) {
            return res.status(404).json({
                ok: false,
                msg: 'Artículo no encontrado'
            });
        }
        res.json({
            ok: true,
            articulo
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}));
// Eliminar un artículo (borrado lógico)
router.delete('/:id', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articulo = yield articulo_model_1.default.findOneAndUpdate({ _id: req.params.id, eliminado: false }, { eliminado: true, updatedDate: new Date() }, { new: true });
        if (!articulo) {
            return res.status(404).json({
                ok: false,
                msg: 'Artículo no encontrado'
            });
        }
        res.json({
            ok: true,
            msg: 'Artículo eliminado'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}));
exports.default = router;
