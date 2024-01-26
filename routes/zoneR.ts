import { Router, Response, Request } from 'express';
import { IZone, Zone } from '../models/zone.model';
import { verificarToken } from '../middlewares/autenticacion';

const zoneRouter = Router();


zoneRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

zoneRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const zone: IZone = req.body
        try {
            const zoneDB = await Zone.create(zone);
            res.status(201).json({
              ok: true,
              zone: zoneDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
zoneRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Zone por su ID
zoneRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

//obtener Zipcodes
zoneRouter.get('/', async (req: Request, res: Response) => {
  try {
      const zones: IZone[] = await Zone.find();
      res.json({
          ok: true,
          zone: zones
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los zonas', error });
  }
});