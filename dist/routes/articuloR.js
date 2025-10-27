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
// Obtener todos los artículos con paginación y filtros
router.get('/', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 100, search = '', grupo = '', familia = '' } = req.query;
        // Convertir a números
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        // Construir filtros
        const filters = { eliminado: false };
        // Filtro de búsqueda por texto
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            filters.$or = [
                { codigo: searchRegex },
                { descripcionArticulo: searchRegex },
                { grupo: searchRegex },
                { familia: searchRegex }
            ];
        }
        // Filtros específicos
        if (grupo) {
            filters.grupo = { $regex: grupo, $options: 'i' };
        }
        if (familia) {
            filters.familia = { $regex: familia, $options: 'i' };
        }
        // Obtener artículos con paginación
        const articulos = yield articulo_model_1.default.find(filters)
            .sort({ createdDate: -1 })
            .skip(skip)
            .limit(limitNumber);
        // Obtener total de documentos para calcular páginas
        const total = yield articulo_model_1.default.countDocuments(filters);
        const totalPages = Math.ceil(total / limitNumber);
        res.json({
            ok: true,
            articulos,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
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
