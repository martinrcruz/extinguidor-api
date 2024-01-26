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
const zone_model_1 = require("../models/zone.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const zoneRouter = (0, express_1.Router)();
zoneRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
zoneRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zone = req.body;
    try {
        const zoneDB = yield zone_model_1.Zone.create(zone);
        res.status(201).json({
            ok: true,
            zone: zoneDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
zoneRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Zone por su ID
zoneRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
//obtener Zipcodes
zoneRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zones = yield zone_model_1.Zone.find();
        res.json({
            ok: true,
            zone: zones
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los zonas', error });
    }
}));
