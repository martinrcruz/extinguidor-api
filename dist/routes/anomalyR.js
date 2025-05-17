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
const anomaly_model_1 = require("../models/anomaly.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const anomalyRouter = (0, express_1.Router)();
anomalyRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
anomalyRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const anomaly = req.body;
    try {
        const anomalyDB = yield anomaly_model_1.Anomaly.create(anomaly);
        res.status(201).json({
            ok: true,
            anomaly: anomalyDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
anomalyRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un sanomaly por su ID
anomalyRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
anomalyRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const anomaly = yield anomaly_model_1.Anomaly.find();
        res.json({
            ok: true,
            anomaly: anomaly
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener anomaly', error });
    }
}));
