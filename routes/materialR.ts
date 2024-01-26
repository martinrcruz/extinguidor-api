import { Router, Response, Request } from 'express';
import { IMaterial, Material } from '../models/material.model';
import { verificarToken } from '../middlewares/autenticacion';

const materialRouter = Router();


materialRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

materialRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const material: IMaterial = req.body
        try {
            const materialDB = await Material.create(material);
            res.status(201).json({
              ok: true,
              material: materialDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
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
          materials: materials
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los Zipcodes', error });
  }
});

//obtener material
materialRouter.get('/', async (req: Request, res: Response) => {
  try {
      const materials: IMaterial[] = await Material.find();
      res.json({
          ok: true,
          materials: materials
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener materials', error });
  }
});