import { Router, Response, Request } from 'express';
import { IAnomaly, Anomaly } from '../models/anomaly.model';
import { verificarToken } from '../middlewares/autenticacion';

const anomalyRouter = Router();


anomalyRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

anomalyRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const anomaly: IAnomaly = req.body
        try {
            const anomalyDB = await Anomaly.create(anomaly);
            res.status(201).json({
              ok: true,
              anomaly: anomalyDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
anomalyRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un sanomaly por su ID
anomalyRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

anomalyRouter.get('/', async (req: Request, res: Response) => {
  try {
      const anomaly: IAnomaly[] = await Anomaly.find();
      res.json({
          ok: true,
          anomaly: anomaly
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener anomaly', error });
  }
});