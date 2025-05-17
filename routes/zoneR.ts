import { Router, Response, Request } from 'express';
import { IZone, Zone } from '../models/zone.model';
import { verificarToken } from '../middlewares/autenticacion';

const zoneRoutes = Router();

/* Ping ─────────────────────────────────────── */
zoneRoutes.get('/prueba', (_req, res) => {
    res.json({ ok: true, data: { message: 'todo ok' } });
});

/* Crear ────────────────────────────────────── */
zoneRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    try {
        const zoneDB = await Zone.create(req.body as IZone);
        res.status(201).json({ ok: true, data: { zone: zoneDB } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al crear zona', message: err.message });
    }
});

/* Actualizar ─────────────────────────────────
 *  Recibe el _id en el body, igual que el frontend.   */
zoneRoutes.put('/update', verificarToken, async (req: Request, res: Response) => {
    const { _id, ...update } = req.body;
    if (!_id) {
        return res.status(400).json({ ok: false, error: 'ID requerido para actualizar' });
    }

    try {
        const zonaActualizada = await Zone.findByIdAndUpdate(_id, update, {
            new: true,
            runValidators: true,
        });

        if (!zonaActualizada) {
            return res.status(404).json({ ok: false, error: 'Zona no encontrada' });
        }
        res.json({ ok: true, data: { zone: zonaActualizada } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al actualizar zona', message: error.message });
    }
});

/* Eliminar ─────────────────────────────────── */
zoneRoutes.delete('/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const zonaEliminada = await Zone.findByIdAndDelete(req.params.id);
        if (!zonaEliminada) {
            return res.status(404).json({ ok: false, error: 'Zona no encontrada' });
        }
        res.json({ ok: true, data: { zone: zonaEliminada } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al eliminar zona', message: error.message });
    }
});


/* Listar todas ─────────────────────────────── */
zoneRoutes.get('/', async (_req, res) => {
    try {
        const zones = await Zone.find().populate({ path: 'codezip', select: 'name codezip' });
        res.json({ ok: true, data: { zones } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener zonas', message: err.message });
    }
});

/* Obtener una ──────────────────────────────── */
zoneRoutes.get('/:id', async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ ok: false, error: 'Zona no encontrada' });
        }
        res.json({ ok: true, data: { zone } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener zona', message: error.message });
    }
});

export default zoneRoutes;
