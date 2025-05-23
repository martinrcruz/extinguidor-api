import { Router, Response, Request } from 'express';
import { IFacturacion, Facturacion } from '../models/facturacion.model';
import { verificarToken } from '../middlewares/autenticacion';

const facturacionRoutes = Router();

/* ─────────────────────────────────────────────
 *  GET  /facturacion/prueba  (ping)
 * ───────────────────────────────────────────── */
facturacionRoutes.get('/prueba', (_req: Request, res: Response) => {
    res.json({ ok: true, data: { message: 'todo ok' } });
});

/* ─────────────────────────────────────────────
 *  POST /facturacion/create
 * ───────────────────────────────────────────── */
facturacionRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    try {
        const facturacionDB = await Facturacion.create(req.body as IFacturacion);
        res.status(201).json({ ok: true, data: { facturacion: facturacionDB } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al crear facturación', message: err.message });
    }
});

/* ─────────────────────────────────────────────
 *  PUT /facturacion/update/:id
 * ───────────────────────────────────────────── */
facturacionRoutes.put('/update/:id', verificarToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const facturacionActualizada = await Facturacion.findByIdAndUpdate(
            id,
            req.body,                       // campos a actualizar
            { new: true, runValidators: true }
        )
            .populate({
                path: 'ruta',
                select: 'name',
                populate: { path: 'name', select: 'name' }
            })
            .populate({ path: 'parte', select: 'description' });

        if (!facturacionActualizada) {
            return res.status(404).json({ ok: false, error: 'Facturación no encontrada' });
        }

        res.json({ ok: true, data: { facturacion: facturacionActualizada } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al actualizar facturación', message: error.message });
    }
});

/* ─────────────────────────────────────────────
 *  DELETE /facturacion/:id
 * ───────────────────────────────────────────── */
facturacionRoutes.delete('/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const result = await Facturacion.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ ok: false, error: 'Facturación no encontrada' });
        }
        res.json({ ok: true, data: { facturacion: result } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al eliminar facturación', message: error.message });
    }
});

/* ─────────────────────────────────────────────
 *  GET /facturacion         (todas)
 *  GET /facturacion/ruta/:ruta
 *  GET /facturacion/:id      (una)
 * ───────────────────────────────────────────── */
facturacionRoutes.get('/', async (_req, res) => {
    try {
        const facturaciones = await Facturacion.find()
            .populate({ path: 'ruta', select: 'name', populate: { path: 'name', select: 'name' } })
            .populate({ path: 'parte', select: 'description' });

        res.json({ ok: true, data: { facturacion: facturaciones } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener facturaciones', message: error.message });
    }
});

facturacionRoutes.get('/ruta/:ruta', async (req, res) => {
    try {
        const facturaciones = await Facturacion.find({ ruta: req.params.ruta }).populate('parte');
        res.json({ ok: true, data: { facturacion: facturaciones } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener facturaciones por ruta', message: error.message });
    }
});

facturacionRoutes.get('/:id', async (req, res) => {
    try {
        const facturacion = await Facturacion.findById(req.params.id)
            .populate({ path: 'ruta', select: 'name', populate: { path: 'name', select: 'name' } })
            .populate({ path: 'parte', select: 'description' });

        if (!facturacion) {
            return res.status(404).json({ ok: false, error: 'Facturación no encontrada' });
        }
        res.json({ ok: true, data: { facturacion } });
    } catch (error: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener facturación', message: error.message });
    }
});

export default facturacionRoutes;
