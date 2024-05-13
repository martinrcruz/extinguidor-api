import { Router, Response, Request } from 'express';
import { IMaterialParte, MaterialParte } from '../models/materialParte.model';
import { verificarToken } from '../middlewares/autenticacion';

const materialParteRouter = Router();


materialParteRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

materialParteRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const materialParte: IMaterialParte = req.body
        try {
            const materialParteDB = await MaterialParte.create(materialParte);
            res.status(201).json({
              ok: true,
              materialParte: materialParteDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
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
          materialPartes: materialPartes
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los Zipcodes', error });
  }
});

//obtener materialParte
materialParteRouter.get('/', async (req: Request, res: Response) => {
  try {
      const materialPartes: IMaterialParte[] = await MaterialParte.find();
      res.json({
          ok: true,
          materialPartes: materialPartes
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener materialPartes', error });
  }
});


export default materialParteRouter