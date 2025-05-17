import { Router, Response, Request } from 'express';
import { IZipcode, Zipcode } from '../models/zipcode.model';
import { verificarToken } from '../middlewares/autenticacion';

const zipcodeRouter = Router();

/* Ping ───────────────────────────────────────── */
zipcodeRouter.get('/prueba', (_req, res) =>
    res.json({ ok: true, data: { message: 'todo ok' } })
);

/* Crear ──────────────────────────────────────── */
zipcodeRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
    try {
        const zipcodeDB = await Zipcode.create(req.body as IZipcode);
        res.status(201).json({ ok: true, data: { zipcode: zipcodeDB } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al crear código postal', message: err.message });
    }
});

/* Actualizar ─────────────────────────────────── */
zipcodeRouter.put('/update', verificarToken, async (req: Request, res: Response) => {
    const { _id, ...update } = req.body;
    if (!_id) return res.status(400).json({ ok: false, error: 'ID requerido' });

    try {
        const zipUpd = await Zipcode.findByIdAndUpdate(_id, update, { new: true, runValidators: true });
        if (!zipUpd) return res.status(404).json({ ok: false, error: 'Código postal no encontrado' });
        res.json({ ok: true, data: { zipcode: zipUpd } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al actualizar código postal', message: err.message });
    }
});

/* Eliminar ───────────────────────────────────── */
zipcodeRouter.delete('/:id', verificarToken, async (req, res) => {
    try {
        const z = await Zipcode.findByIdAndDelete(req.params.id);
        if (!z) return res.status(404).json({ ok: false, error: 'Código postal no encontrado' });
        res.json({ ok: true, data: { zipcode: z } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al eliminar código postal', message: err.message });
    }
});

/* Listar ─────────────────────────────────────── */
zipcodeRouter.get('/', async (_req, res) => {
    try {
        const zipcodes = await Zipcode.find();
        res.json({ ok: true, data: { zipcodes } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener códigos postales', message: err.message });
    }
});

/* Obtener uno ────────────────────────────────── */
zipcodeRouter.get('/:id', async (req, res) => {
    try {
        const z = await Zipcode.findById(req.params.id);
        if (!z) return res.status(404).json({ ok: false, error: 'Código postal no encontrado' });
        res.json({ ok: true, data: { zipcode: z } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al obtener código postal', message: err.message });
    }
});

export default zipcodeRouter;
