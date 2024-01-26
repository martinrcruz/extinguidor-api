import { Router, Response, Request } from 'express';
import { ISolution, Solution } from '../models/solution.model';
import { verificarToken } from '../middlewares/autenticacion';

const solutionRouter = Router();


solutionRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

solutionRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const solution: ISolution = req.body
        try {
            const solutionDB = await Solution.create(solution);
            res.status(201).json({
              ok: true,
              solution: solutionDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
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
          solutions: solutions
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los solutions', error });
  }
});