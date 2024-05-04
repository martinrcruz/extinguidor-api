import { Router, Response, Request } from 'express';
import { IRuta, Ruta } from '../models/rutas.model';
import { verificarToken } from '../middlewares/autenticacion';
import { RutaN } from '../models/rutaN.model';

const rutaNRoutes = Router();


rutaNRoutes.get('/prueba',verificarToken, (req: Request, res: Response) => {

  res.json({
    ok: true,
    mje: 'todo ok'
  })
});

rutaNRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
          const ruta: IRuta = req.body
          console.log(ruta)
          try {
              const rutaDB = await RutaN.create(ruta);
              res.status(201).json({
                ok: true,
                ruta: rutaDB
              });
            } catch (err) {
              res.status(500).json({ message: 'Error al admin', err });
            }
});


//actializar
rutaNRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Ruta por su ID
rutaNRoutes.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

    try {
        const rutaN: IRuta | null = await RutaN.findById(id);
        if (rutaN) {
            res.json({
                ok: true,
                ruta: rutaN
            });
        } else {
            res.status(404).json({ message: 'ruta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }

});

rutaNRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const rutas: IRuta[] = await RutaN.find();
    res.json({
      ok: true,
      rutas: rutas
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});




export default rutaNRoutes;