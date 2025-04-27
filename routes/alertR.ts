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
        res.json({ 
            ok: true, 
            data: { alertas }
        });
    } catch (err: any) {
        console.error('Error GET /alertas', err);
        res.status(500).json({ 
            ok: false, 
            error: 'Error al obtener alertas',
            message: err.message
        });
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
            return res.status(404).json({ 
                ok: false, 
                error: 'Alerta no encontrada',
                message: 'Alerta no encontrada'
            });
        }
        res.json({ 
            ok: true, 
            data: { alerta }
        });
    } catch (err: any) {
        console.error(`Error PUT /alertas/${id}`, err);
        res.status(500).json({ 
            ok: false, 
            error: 'Error al actualizar alerta',
            message: err.message
        });
    }
});

export default alertaRouter;
