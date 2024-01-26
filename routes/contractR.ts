import express, { Request, Response } from 'express';
import { Contract } from '../models/contracts.model';


const contractRouter = express.Router();

// Get all contracts
contractRouter.get('/', async (req: Request, res: Response) => {
    try {
        const contracts = await Contract.find();
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific contract by ID
contractRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (contract) {
            res.json(contract);
        } else {
            res.status(404).json({ error: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new contract
contractRouter.post('/', async (req: Request, res: Response) => {
    try {
        const newContract = new Contract(req.body);
        const savedContract = await newContract.save();
        res.status(201).json(savedContract);
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
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
            res.json(updatedContract);
        } else {
            res.status(404).json({ error: 'Contract not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// Delete a specific contract by ID
contractRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedContract = await Contract.findByIdAndDelete(req.params.id);
        if (deletedContract) {
            res.json(deletedContract);
        } else {
            res.status(404).json({ error: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default contractRouter;