import { Router, Response, Request } from 'express';
import { IZone, Zone } from '../models/zone.model';
import { verificarToken } from '../middlewares/autenticacion';

const zoneRoutes = Router();


zoneRoutes.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

zoneRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    const zone: IZone = req.body
    try {
        const zoneDB = await Zone.create(zone);
        res.status(201).json({
            ok: true,
            data: { zone: zoneDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear zona',
            message: err.message
        });
    }
});


//actializar
zoneRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Zone por su ID
zoneRoutes.delete('/:id', async (req: Request, res: Response) => {
 
});

//obtener Zipcodes
zoneRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const zones: IZone[] = await Zone.find();
        res.json({
            ok: true,
            data: { zones }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener zonas',
            message: error.message
        });
    }
});

// Ruta para obtener una zona específica
zoneRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const zone: IZone | null = await Zone.findById(id);
        if (!zone) {
            return res.status(404).json({
                ok: false,
                error: 'Zona no encontrada',
                message: 'Zona no encontrada'
            });
        }
        res.json({
            ok: true,
            data: { zone }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener zona',
            message: error.message
        });
    }
});


export default zoneRoutes;