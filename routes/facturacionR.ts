import { Router, Response, Request } from 'express';
import { IFacturacion, Facturacion } from '../models/facturacion.model';
import { verificarToken } from '../middlewares/autenticacion';

const facturacionRoutes = Router();


facturacionRoutes.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

facturacionRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    const facturacion: IFacturacion = req.body
    try {
        const facturacionDB = await Facturacion.create(facturacion);
        res.status(201).json({
            ok: true,
            data: { facturacion: facturacionDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear facturación',
            message: err.message
        });
    }
});



facturacionRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
});


facturacionRoutes.delete('/:id', async (req: Request, res: Response) => {
 
});


facturacionRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const facturacions = await Facturacion.find()
            .populate({
                path: 'ruta',
                select: 'name',
                populate: { path: 'name', select: 'name' }
            })
            .populate({ path: 'parte', select: 'description' });
        res.json({
            ok: true,
            data: { facturacion: facturacions }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener facturaciones',
            message: error.message
        });
    }
});

facturacionRoutes.get('/ruta/:ruta', async (req: Request, res: Response) => {
    const ruta = req.params.ruta;
    try {
        const facturacions: IFacturacion[] = await Facturacion.find({ ruta: ruta }).populate('parte');
        res.json({
            ok: true,
            data: { facturacion: facturacions }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener facturaciones por ruta',
            message: error.message
        });
    }
});

// Ruta para obtener una facturación específica
facturacionRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const facturacion: IFacturacion | null = await Facturacion.findById(id)
            .populate({
                path: 'ruta',
                select: 'name',
                populate: { path: 'name', select: 'name' }
            })
            .populate({ path: 'parte', select: 'description' });
        
        if (!facturacion) {
            return res.status(404).json({
                ok: false,
                error: 'Facturación no encontrada',
                message: 'Facturación no encontrada'
            });
        }
        res.json({
            ok: true,
            data: { facturacion }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener facturación',
            message: error.message
        });
    }
});

export default facturacionRoutes;
