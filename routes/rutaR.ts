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
          console.log(ruta)
          try {
              const rutaDB = await Ruta.create(ruta);
              res.status(201).json({
                ok: true,
                ruta: rutaDB
              });
            } catch (err) {
              res.status(500).json({ message: 'Error ', err });
            }
});


//actializar
rutaRoutes.post('/update', verificarToken, async (req: any, res: Response) => {
  const idruta = req.body._id
  const updatedRutaData: IRuta = req.body;
  console.log(updatedRutaData)
  try {
    const rutaDB = await Ruta.findByIdAndUpdate(idruta, updatedRutaData, { new: true });
    if (!rutaDB) {
      return res.status(404).json({ message: 'Parte no encontrada' });
    }
    res.status(200).json({
      ok: true,
      ruta: rutaDB
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la ruta', err });
  }
});


rutaRoutes.get('/:id', verificarToken, async (req: Request, res: Response) => {
  const { id } = req.params;

    try {
        const ruta: IRuta | null = await Ruta.findById(id).populate('vehicle').populate('users').populate('name');
        if (ruta) {
            res.json({
                ok: true,
                ruta: ruta
            });
        } else {
            res.status(404).json({ message: 'ruta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }

});

rutaRoutes.get('/', async (req: Request, res: Response) => {
  const eliminado= false
  try {
    const rutas: IRuta[] = await Ruta.find({ eliminado: eliminado }).populate('vehicle').populate('users').populate('name');
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
  const eliminado= false
  try {
    const rutas: IRuta[] = await Ruta.find({ date: date },{ eliminado: eliminado }).populate('users').populate('vehicle').populate('name');
    res.json({
      ok: true,
      rutas: rutas
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});



export default rutaRoutes;