import { Router, Response, Request } from 'express';
import { IFacturacion, Facturacion } from '../models/facturacion.model';
import { verificarToken } from '../middlewares/autenticacion';

const facturacionRoutes = Router();


facturacionRoutes.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

facturacionRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
        const facturacion: IFacturacion = req.body
        try {
            const facturacionDB = await Facturacion.create(facturacion);
            res.status(201).json({
              ok: true,
              facturacion: facturacionDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});



facturacionRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
});


facturacionRoutes.delete('/:id', async (req: Request, res: Response) => {
 
});


facturacionRoutes.get('/', async (req: Request, res: Response) => {
  try {

      const facturacions = await Facturacion.find()
          .populate({
              path: 'ruta',
              select: 'name',
              populate: { path: 'name', select: 'name' }
          })
          .populate({ path: 'parte', select: 'description' })
      res.json({
          ok: true,
          facturacion: facturacions
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener las facturas', error });
  }
});

facturacionRoutes.get('/ruta/:ruta', async (req: Request, res: Response) => {
  const ruta = req.params.ruta
  try {
      const facturacions: IFacturacion[] = await Facturacion.find({ ruta: ruta }).populate('parte');
      res.json({
          ok: true,
          facturacion: facturacions
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los zonas', error });
  }
});


export default facturacionRoutes;
