import { Router, Response, Request } from 'express';
import { IMaterial, Material } from '../models/material.model';
import { verificarToken } from '../middlewares/autenticacion';

const materialRouter = Router();


materialRouter.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

materialRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
    const material: IMaterial = req.body
    try {
        const materialDB = await Material.create(material);
        res.status(201).json({
            ok: true,
            data: { material: materialDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear material',
            message: err.message
        });
    }
});


//actializar
materialRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Material por su ID
materialRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

materialRouter.get('/', async (req: Request, res: Response) => {
    try {
        const materials: IMaterial[] = await Material.find();
        res.json({
            ok: true,
            data: { materials }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener materiales',
            message: error.message
        });
    }
});

//obtener material
materialRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const material: IMaterial | null = await Material.findById(id);
        if (!material) {
            return res.status(404).json({
                ok: false,
                error: 'Material no encontrado',
                message: 'Material no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { material }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener material',
            message: error.message
        });
    }
});


export default materialRouter