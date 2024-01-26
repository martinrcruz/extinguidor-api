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
const pais_model_1 = require("../models/lugares/pais.model");
const provincia_model_1 = require("../models/lugares/provincia.model");
const ciudad_model_1 = require("../models/lugares/ciudad.model");
const lugaresRoutes = (0, express_1.Router)();
lugaresRoutes.get('/paises', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paises = yield pais_model_1.Pais.find()
        .exec();
    res.json({
        ok: true,
        paises
    });
}));
lugaresRoutes.get('/provincias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pais = req.query.pais;
    const provincias = yield provincia_model_1.Provincia.find({ pais: pais })
        .exec();
    res.json({
        ok: true,
        provincias
    });
}));
lugaresRoutes.get('/ciudades', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const provincia = req.query.provincia;
    const ciudades = yield ciudad_model_1.Ciudad.find({ provincia: provincia })
        .exec();
    res.json({
        ok: true,
        ciudades
    });
}));
exports.default = lugaresRoutes;
