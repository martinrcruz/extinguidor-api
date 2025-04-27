import { Router, Response, Request } from 'express';
import { IMaterialParte, MaterialParte } from '../models/materialParte.model';
import { verificarToken } from '../middlewares/autenticacion';

const materialParteRouter = Router();


materialParteRouter.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

materialParteRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
    const materialParte: IMaterialParte = req.body
    try {
        const materialParteDB = await MaterialParte.create(materialParte);
        res.status(201).json({
            ok: true,
            data: { materialParte: materialParteDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear material de parte',
            message: err.message
        });
    }
});


//actializar
materialParteRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un MaterialParte por su ID
materialParteRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

materialParteRouter.get('/', async (req: Request, res: Response) => {
    try {
        const materialPartes: IMaterialParte[] = await MaterialParte.find().populate('material');
        res.json({
            ok: true,
            data: { materialPartes }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener materiales de parte',
            message: error.message
        });
    }
});

//obtener materialParte por ruta
materialParteRouter.get('/:ruta', async (req: Request, res: Response) => {
    const ruta = req.params.ruta
    try {
        const materialPartes: IMaterialParte[] = await MaterialParte.find({ ruta: ruta }).populate('material');
        res.json({
            ok: true,
            data: { materialPartes }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener materiales de parte',
            message: error.message
        });
    }
});


export default materialParteRouter