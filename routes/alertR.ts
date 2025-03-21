import { Router, Request, Response } from 'express';
import { Alert } from '../models/alert.model';

const alertaRouter = Router();

/**
 * GET /alertas
 * Devuelve todas las alertas
 */
alertaRouter.get('/', async (req: Request, res: Response) => {
    try {
        const alertas = await Alert.find().exec();
        res.json({ ok: true, alertas });
    } catch (err) {
        console.error('Error GET /alertas', err);
        res.status(500).json({ ok: false, err });
    }
});

/**
 * PUT /alertas/:id
 * Cambia el estado de la alerta (por ejemplo, { state: 'Pendiente'|'Cerrado' })
 */
alertaRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { state } = req.body;

    try {
        const alerta = await Alert.findByIdAndUpdate(id, { state }, { new: true });
        if (!alerta) {
            return res.status(404).json({ ok: false, message: 'Alerta no encontrada' });
        }
        res.json({ ok: true, alerta });
    } catch (err) {
        console.error(`Error PUT /alertas/${id}`, err);
        res.status(500).json({ ok: false, err });
    }
});

export default alertaRouter;
