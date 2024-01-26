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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoestablecimiento_model_1 = require("../models/tipoestablecimiento.model");
const tipoEstRoutes = (0, express_1.Router)();
tipoEstRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipoEst = yield tipoestablecimiento_model_1.TipoEst.find();
        res.json({
            ok: true,
            tipoEst
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener las salas',
            error: err
        });
    }
}));
tipoEstRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const tipoEst = new tipoestablecimiento_model_1.TipoEst({
            nombre
        });
        yield tipoEst.save();
        res.json({
            ok: true,
            tipoEst
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear la sala',
            error: err
        });
    }
}));
exports.default = tipoEstRoutes;
