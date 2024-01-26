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
const zipcode_model_1 = require("../models/zipcode.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const zipcodeRouter = (0, express_1.Router)();
zipcodeRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
zipcodeRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zipcode = req.body;
    try {
        const zipcodeDB = yield zipcode_model_1.Zipcode.create(zipcode);
        res.status(201).json({
            ok: true,
            zipcode: zipcodeDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
zipcodeRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Zipcode por su ID
zipcodeRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
//obtener Zipcodes
zipcodeRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zipcodes = yield zipcode_model_1.Zipcode.find();
        res.json({
            ok: true,
            zipcodes: zipcodes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los Zipcodes', error });
    }
}));
