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
const solution_model_1 = require("../models/solution.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const solutionRouter = (0, express_1.Router)();
solutionRouter.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mje: 'todo ok'
    });
});
solutionRouter.post('/create', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const solution = req.body;
    try {
        const solutionDB = yield solution_model_1.Solution.create(solution);
        res.status(201).json({
            ok: true,
            solution: solutionDB
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al admin', err });
    }
}));
//actializar
solutionRouter.put('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Ruta para eliminar un Solution por su ID
solutionRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
solutionRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const solutions = yield solution_model_1.Solution.find();
        res.json({
            ok: true,
            solutions: solutions
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los solutions', error });
    }
}));
