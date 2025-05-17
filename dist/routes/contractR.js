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
const express_1 = __importDefault(require("express"));
const contracts_model_1 = require("../models/contracts.model");
const contractRouter = express_1.default.Router();
// Get all contracts
contractRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield contracts_model_1.Contract.find();
        res.json({
            ok: true,
            data: { contracts }
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener contratos',
            message: error.message
        });
    }
}));
// Get a specific contract by ID
contractRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield contracts_model_1.Contract.findById(req.params.id);
        if (contract) {
            res.json({
                ok: true,
                data: { contract }
            });
        }
        else {
            res.status(404).json({
                ok: false,
                error: 'Contrato no encontrado',
                message: 'Contrato no encontrado'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al obtener contrato',
            message: error.message
        });
    }
}));
// Create a new contract
contractRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newContract = new contracts_model_1.Contract(req.body);
        const savedContract = yield newContract.save();
        res.status(201).json({
            ok: true,
            data: { contract: savedContract }
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            error: 'Error al crear contrato',
            message: error.message
        });
    }
}));
// Update a specific contract by ID
contractRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedContract = yield contracts_model_1.Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedContract) {
            res.json({
                ok: true,
                data: { contract: updatedContract }
            });
        }
        else {
            res.status(404).json({
                ok: false,
                error: 'Contrato no encontrado',
                message: 'Contrato no encontrado'
            });
        }
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            error: 'Error al actualizar contrato',
            message: error.message
        });
    }
}));
// Delete a specific contract by ID
contractRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedContract = yield contracts_model_1.Contract.findByIdAndDelete(req.params.id);
        if (deletedContract) {
            res.json({
                ok: true,
                data: { contract: deletedContract }
            });
        }
        else {
            res.status(404).json({
                ok: false,
                error: 'Contrato no encontrado',
                message: 'Contrato no encontrado'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al eliminar contrato',
            message: error.message
        });
    }
}));
exports.default = contractRouter;
