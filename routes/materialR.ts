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
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({ 
                ok: false,
                error: 'ID no proporcionado',
                message: 'Se requiere el ID del material'
            });
        }
        
        const updated = await Material.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ 
                ok: false,
                error: 'Material no encontrado',
                message: 'Material no encontrado'
            });
        }
        
        res.json({ 
            ok: true, 
            data: { material: updated }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al actualizar material',
            message: err.message
        });
    }
});

// Ruta para eliminar un Material por su ID
materialRouter.delete('/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Material.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ 
                ok: false,
                error: 'Material no encontrado',
                message: 'Material no encontrado'
            });
        }
        
        res.json({ 
            ok: true, 
            data: { message: 'Material eliminado correctamente' }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al eliminar material',
            message: err.message
        });
    }
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