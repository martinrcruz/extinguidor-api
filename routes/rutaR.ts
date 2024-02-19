import { Router, Response, Request } from 'express';
import { IRuta, Ruta } from '../models/rutas.model';
import { verificarToken } from '../middlewares/autenticacion';

const rutaRoutes = Router();


rutaRoutes.get('/prueba',verificarToken, (req: Request, res: Response) => {

  res.json({
    ok: true,
    mje: 'todo ok'
  })
});

rutaRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
          const ruta: IRuta = req.body
          ruta.state= 'pendiente'
          console.log(ruta)
          try {
              const rutaDB = await Ruta.create(ruta);
              res.status(201).json({
                ok: true,
                ruta: rutaDB
              });
            } catch (err) {
              res.status(500).json({ message: 'Error al admin', err });
            }
});


//actializar
rutaRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Ruta por su ID
rutaRoutes.delete('/:id', async (req: Request, res: Response) => {

});

rutaRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const rutas: IRuta[] = await Ruta.find().populate('vehicle').populate('users');
    res.json({
      ok: true,
      rutas: rutas
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});
rutaRoutes.get('/fecha/:date', async (req: Request, res: Response) => {
  const date =  req.params.date
  
  try {
    const rutas: IRuta[] = await Ruta.find({ date: date }).populate('users').populate('vehicle');
    res.json({
      ok: true,
      rutas: rutas
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});



export default rutaRoutes;