import express, { Request, Response } from 'express';
import { Contract } from '../models/contracts.model';


const contractRouter = express.Router();

// Get all contracts
contractRouter.get('/', async (req: Request, res: Response) => {
    try {
        const contracts = await Contract.find();
        res.json({
            ok: true,
            data: { contracts }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener contratos',
            message: error.message
        });
    }
});

// Get a specific contract by ID
contractRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (contract) {
            res.json({
                ok: true,
                data: { contract }
            });
        } else {
            res.status(404).json({ 
                ok: false,
                error: 'Contrato no encontrado',
                message: 'Contrato no encontrado'
            });
        }
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener contrato',
            message: error.message
        });
    }
});

// Create a new contract
contractRouter.post('/', async (req: Request, res: Response) => {
    try {
        const newContract = new Contract(req.body);
        const savedContract = await newContract.save();
        res.status(201).json({
            ok: true,
            data: { contract: savedContract }
        });
    } catch (error: any) {
        res.status(400).json({ 
            ok: false,
            error: 'Error al crear contrato',
            message: error.message
        });
    }
});

// Update a specific contract by ID
contractRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const updatedContract = await Contract.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedContract) {
            res.json({
                ok: true,
                data: { contract: updatedContract }
            });
        } else {
            res.status(404).json({ 
                ok: false,
                error: 'Contrato no encontrado',
                message: 'Contrato no encontrado'
            });
        }
    } catch (error: any) {
        res.status(400).json({ 
            ok: false,
            error: 'Error al actualizar contrato',
            message: error.message
        });
    }
});

// Delete a specific contract by ID
contractRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedContract = await Contract.findByIdAndDelete(req.params.id);
        if (deletedContract) {
            res.json({
                ok: true,
                data: { contract: deletedContract }
            });
        } else {
            res.status(404).json({ 
                ok: false,
                error: 'Contrato no encontrado',
                message: 'Contrato no encontrado'
            });
        }
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al eliminar contrato',
            message: error.message
        });
    }
});

export default contractRouter;