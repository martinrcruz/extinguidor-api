import { Router, Response, Request } from 'express';
import { IRuta, Ruta } from '../models/rutas.model';
import { verificarToken } from '../middlewares/autenticacion';
import {Parte} from "../models/parte.model";
import { startOfMonth, endOfMonth } from 'date-fns';

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
        const { date, name, state, vehicle, users, comentarios, encargado, herramientas } = req.body;

        // Encargado obligatorio
        if (!encargado) {
            return res.status(400).json({
                ok: false,
                message: 'Encargado es obligatorio'
            });
        }

        const rutaDB = await Ruta.create({
            date,
            name,
            state: state || 'Pendiente',
            vehicle: vehicle || null,
            users: users || [],
            comentarios: comentarios || '',
            encargado,
            herramientas: herramientas || []
        });

        res.status(201).json({ ok: true, ruta: rutaDB });

    } catch (err) {
        res.status(500).json({ message: 'Error al crear ruta', err });
    }
});


//actializar
rutaRoutes.post('/update', verificarToken, async (req: any, res: Response) => {
  const idruta = req.body._id
  const updatedRutaData: IRuta = req.body;
  console.log(updatedRutaData)
    try {
        const idruta = req.body._id;
        if (!req.body.encargado) {
            return res.status(400).json({
                ok: false,
                message: 'Encargado es obligatorio'
            });
        }

        const updatedRutaData: IRuta = req.body;
        const rutaDB = await Ruta.findByIdAndUpdate(idruta, updatedRutaData, { new: true });
        if (!rutaDB) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        res.status(200).json({ ok: true, ruta: rutaDB });

    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la ruta', err });
    }
});

rutaRoutes.get('/disponibles', verificarToken, async (req: Request, res: Response) => {
    try {
        // 1) Tomar query param date=YYYY-MM-DD, o por defecto la fecha actual
        const dateStr = req.query.date as string;
        let baseDate: Date;

        if (dateStr) {
            baseDate = new Date(dateStr);
            if (isNaN(baseDate.getTime())) {
                return res.status(400).json({ ok: false, message: 'date inválido' });
            }
        } else {
            baseDate = new Date(); // hoy
        }
        // 2) Calcular inicio y fin de mes con date-fns
        const start = startOfMonth(baseDate);
        const end = endOfMonth(baseDate);

        // 3) Buscar rutas en ese rango
        const rutasDisponibles = await Ruta.find({
            date: { $gte: start, $lte: end },
            eliminado: false
        })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .exec();

        // 4) En tu proyecto, “disponibles” podría tener más lógica,
        //    ej. no asignadas a un vehículo, etc. Ajusta si corresponde.

        res.json({
            ok: true,
            rutas: rutasDisponibles
        });
    } catch (err) {
        console.error('Error GET /rutas/disponibles =>', err);
        res.status(500).json({ ok: false, err });
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


/**
 * GET /rutas/fecha/:fecha
 * Devuelve la ruta asignada a esa fecha (si existe).
 * Formato de fecha: 'YYYY-MM-DD'
 */
rutaRoutes.get('/fecha/:fecha', async (req: Request, res: Response) => {
    const fechaParam = req.params.fecha; // "2025-04-10"

    try {
        // Si permites solo 1 ruta al día, usas findOne.
        // Si permites múltiples rutas, usas find.
        const ruta = await Ruta.findOne({ date: fechaParam })
            .populate('vehicle')
            .populate('users')
            .populate('name') // si name es un objectId a RutaN, etc.
            .exec();

        if (!ruta) {
            return res.json({ ok: false, message: 'No hay ruta para esa fecha' });
        }

        res.json({ ok: true, ruta });
    } catch (err) {
        console.error('Error /rutas/fecha/:fecha', err);
        res.status(500).json({ ok: false, err });
    }
});

/**
 * POST /rutas
 * Crea una nueva ruta (date, etc.).
 * Body esperado: { date, name, type, vehicle, users }
 */
rutaRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const { date, name, type, vehicle, users } = req.body;

        // Creamos la nueva ruta
        const nuevaRuta = await Ruta.create({
            date,
            name,
            type,
            vehicle,
            users
        });

        res.json({ ok: true, ruta: nuevaRuta });
    } catch (err) {
        console.error('Error POST /rutas', err);
        res.status(500).json({ ok: false, err });
    }
});

/**
 * GET /rutas/:rutaId/partes
 * Devuelve los partes asociados a la ruta con _id = :rutaId
 */
rutaRoutes.get('/:rutaId/partes', async (req: Request, res: Response) => {
    const rutaId = req.params.rutaId;
    try {
        const partes = await Parte.find({ ruta: rutaId }).exec();
        res.json({ ok: true, partes });
    } catch (err) {
        console.error(`Error GET /rutas/${rutaId}/partes`, err);
        res.status(500).json({ ok: false, err });
    }
});

/**
 * POST /rutas/:id/asignarPartes
 * Body: { parteIds: string[] }
 * Asigna esos partes a la ruta, marcando asignado = true y ruta = :id
 */
rutaRoutes.post('/:id/asignarPartes', async (req: Request, res: Response) => {
    try {
        const rutaId = req.params.id;
        const { parteIds } = req.body; // array de IDs

        if (!parteIds || !Array.isArray(parteIds)) {
            return res.status(400).json({ ok: false, message: 'parteIds debe ser array' });
        }

        // Actualizar
        await Parte.updateMany(
            { _id: { $in: parteIds } },
            { $set: { asignado: true, ruta: rutaId } }
        );

        res.json({ ok: true, message: 'Partes asignados a la ruta' });
    } catch (err) {
        console.error('Error /rutas/:id/asignarPartes', err);
        res.status(500).json({ ok: false, err });
    }
});

/**
 * GET /rutas/porFecha/:fecha
 * Devuelve todas las rutas cuya fecha (date) esté entre el inicio y fin del día indicado.
 * Formato de fecha: "YYYY-MM-DD"
 */
rutaRoutes.get('/porFecha/:fecha', async (req: Request, res: Response) => {
    const { fecha } = req.params; // Ejemplo: "2025-02-23"
    try {
        // Convertir el parámetro en un rango UTC para abarcar todo el día
        const start = new Date(fecha + 'T00:00:00.000Z');
        const end = new Date(fecha + 'T23:59:59.999Z');

        // Buscar todas las rutas cuya fecha esté entre start y end
        const rutas = await Ruta.find({
            date: { $gte: start, $lte: end },
            eliminado: false
        })
            .populate('vehicle')
            .populate('users')
            .populate('name')
            .exec();

        res.json({ ok: true, rutas });
    } catch (err) {
        console.error('Error GET /rutas/porFecha/:fecha =>', err);
        res.status(500).json({ ok: false, err });
    }
});



export default rutaRoutes;
