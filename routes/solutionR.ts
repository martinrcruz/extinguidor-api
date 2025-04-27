import { Router, Response, Request } from 'express';
import { ISolution, Solution } from '../models/solution.model';
import { verificarToken } from '../middlewares/autenticacion';

const solutionRouter = Router();


solutionRouter.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

solutionRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
    const solution: ISolution = req.body
    try {
        const solutionDB = await Solution.create(solution);
        res.status(201).json({
            ok: true,
            data: { solution: solutionDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear solución',
            message: err.message
        });
    }
});


//actializar
solutionRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Solution por su ID
solutionRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

solutionRouter.get('/', async (req: Request, res: Response) => {
    try {
        const solutions: ISolution[] = await Solution.find();
        res.json({
            ok: true,
            data: { solutions }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener soluciones',
            message: error.message
        });
    }
});

// Ruta para obtener una solución específica
solutionRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const solution: ISolution | null = await Solution.findById(id);
        if (!solution) {
            return res.status(404).json({
                ok: false,
                error: 'Solución no encontrada',
                message: 'Solución no encontrada'
            });
        }
        res.json({
            ok: true,
            data: { solution }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener solución',
            message: error.message
        });
    }
});