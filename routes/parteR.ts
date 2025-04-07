import { Router, Response, Request } from 'express';
import { IRuta, Ruta } from '../models/rutas.model';
import { verificarToken } from '../middlewares/autenticacion';
import { IParte, Parte } from '../models/parte.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';
import { IDocumentParte, DocumentParte } from '../models/documentsParte.model';
import { startOfMonth, endOfMonth } from 'date-fns';

const parteRoutes = Router();
const fileSystem = new FileSystem();

/**
 * GET /partes => lista todas, populando “customer” y “ruta”
 */
parteRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const partes = await Parte.find()
        .populate('customer')
        .populate('ruta')
        .exec();
    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partes', error });
  }
});

/**
 * POST /partes/create => crea un parte.
 * Si periodico=true, genera múltiples partes.
 * Se fuerza day=1 en la fecha para manejar mes/año.
 */
parteRoutes.post('/create', verificarToken, async (req: any, res: Response) => {
  try {
    const data = req.body;
    // Documentos (opc.)
    const documentsParte = data.docs;
    delete data.docs;

    // Verificar y forzar day=1 en la fecha. No anterior al mes actual
    const fecha = new Date(data.date);
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (fecha < firstOfMonth) {
      return res.status(400).json({
        ok: false,
        message: 'La fecha no puede ser anterior al mes actual'
      });
    }
    fecha.setDate(1);
    data.date = fecha;

    // Revisar si es periódico
    if (data.periodico && data.endDate) {
      const fechaFin = new Date(data.endDate);
      const inc = getMonthsIncrement(data.frequency);

      let fechaActual = new Date(data.date);
      const partesGuardadas: IParte[] = [];

      // Crear primera
      const primerParte = await Parte.create(data);
      if (documentsParte) {
        for (const doc of documentsParte) {
          await DocumentParte.create({ ...doc, parte: primerParte._id });
        }
      }
      partesGuardadas.push(primerParte);

      // Generar recurrences
      while (true) {
        fechaActual.setMonth(fechaActual.getMonth() + inc);
        if (fechaActual > fechaFin) break;

        const otroParte = { ...data, date: new Date(fechaActual) };
        const otroParteDB = await Parte.create(otroParte);
        partesGuardadas.push(otroParteDB);
        // Si quieres duplicar docs en cada parte, repite la lógica
      }

      return res.status(201).json({ ok: true, partes: partesGuardadas });
    } else {
      // Caso no periódico
      const parteDB = await Parte.create(data);
      if (documentsParte) {
        for (const doc of documentsParte) {
          await DocumentParte.create({ ...doc, parte: parteDB._id });
        }
      }
      return res.status(201).json({ ok: true, parte: parteDB });
    }
  } catch (err) {
    console.error('Error al crear parte =>', err);
    res.status(500).json({ message: 'Error al crear parte', err });
  }
});

/**
 * Función auxiliar: Convierte frequency en #meses
 */
function getMonthsIncrement(freq?: string): number {
  switch (freq) {
    case 'Mensual': return 1;
    case 'Trimestral': return 3;
    case 'Semestral': return 6;
    case 'Anual': return 12;
    default: return 1;
  }
}

/**
 * POST /partes/update => Actualiza un parte
 */
parteRoutes.post('/update', async (req: any, res: Response) => {
  try {
    const idparte = req.body._id;
    if (req.body.date) {
      const fecha = new Date(req.body.date);
      // Chequeamos que no sea anterior al mes actual
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (fecha < firstOfMonth) {
        return res.status(400).json({
          ok: false,
          message: 'La fecha no puede ser anterior al mes actual'
        });
      }
      fecha.setDate(1);
      req.body.date = fecha;
    }

    // Si state=Finalizado => finalizadoTime
    if (req.body.state === 'Finalizado') {
      req.body.finalizadoTime = new Date();
    }

    const parteDB = await Parte.findByIdAndUpdate(idparte, req.body, { new: true });
    if (!parteDB) {
      return res.status(404).json({ message: 'Parte no encontrada' });
    }
    res.status(200).json({ ok: true, parte: parteDB });

  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la parte', err });
  }
});

/**
 * GET /partes/noAsignadosEnMes?date=YYYY-MM-DD
 * Muestra partes asignado=false en ese mes
 */
parteRoutes.get('/noAsignadosEnMes', async (req: Request, res: Response) => {
  try {
    const dateStr = req.query.date as string;
    if (!dateStr) {
      return res.status(400).json({ ok: false, message: 'Falta query param date' });
    }
    const fecha = new Date(dateStr);
    const start = startOfMonth(fecha);
    const end = endOfMonth(fecha);

    const partes = await Parte.find({
      asignado: false,
      date: { $gte: start, $lte: end }
    }).populate('customer').populate('ruta').exec();

    res.json({ ok: true, partes });
  } catch (err) {
    console.error('Error GET /partes/noAsignadosEnMes', err);
    res.status(500).json({ ok: false, err });
  }
});

/**
 * GET /partes/contrato/:contrato
 */
parteRoutes.get('/contrato/:contrato', async (req: Request, res: Response) => {
  const contrato = req.params.contrato;
  try {
    const partes: IParte[] = await Parte.find({ customer: contrato })
        .populate('ruta')
        .populate({
          path: 'customer',
          populate: { path: 'zone' }
        })
    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});

/**
 * GET /partes/ruta/:ruta
 */
parteRoutes.get('/ruta/:ruta', async (req: Request, res: Response) => {
  const ruta = req.params.ruta;
  try {
    const partes: IParte[] = await Parte.find({ ruta })
        .populate({
          path: 'customer',
          populate: { path: 'zone' }
        })
    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});

/**
 * GET /partes/noasignados
 */
parteRoutes.get('/noasignados', async (req: Request, res: Response) => {
  const fechaInicio = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaInicio.getDate() + 30);
  fechaInicio.setDate(fechaInicio.getDate() - 360);

  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}`;
  const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}`;

  const asignado = false;
  try {
    const partes: IParte[] = await Parte.find({
      asignado,
      eliminado: false,
      date: {
        $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate({
      path: 'customer',
      populate: { path: 'zone'  }
    })

    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});

/**
 * GET /partes/noasignado/:fecha
 */
parteRoutes.get('/noasignado/:fecha', async (req: Request, res: Response) => {
  const fecha = new Date(req.params.fecha);
  const fechaInicio = new Date();
  fechaInicio.setDate(fecha.getDate() - 365);

  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}`;
  const formattedEndDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;

  const noasignado = false;
  try {
    const partes: IParte[] = await Parte.find({
      asignado: noasignado,
      date: {
        $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate({
      path: 'customer',
      populate: { path: 'zone' }
    })

    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});

/**
 * GET /partes/asignado
 */
parteRoutes.get('/asignado', async (req: Request, res: Response) => {
  const fechaInicio = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaInicio.getDate() - 1);

  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
  const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;

  const asignado = true;
  try {
    const partes: IParte[] = await Parte.find({
      asignado,
      date: {
        // $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate({
      path: 'customer',
      populate: { path: 'zone' }
    }).populate('ruta')

    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});

/**
 * GET /partes/nofin
 */
parteRoutes.get('/nofin', async (req: Request, res: Response) => {
  const fechaInicio = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaInicio.getDate() - 1);

  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
  const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;

  const asignado = true;
  try {
    const partes: IParte[] = await Parte.find({
      asignado,
      state: { $ne: 'Finalizado' },
      date: {
        // $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate({
      path: 'customer',
      populate: { path: 'zone' }
    }).populate('ruta')

    res.json({ ok: true, partes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});

parteRoutes.get('/finalizadasEnMes', async (req: Request, res: Response) => {
  try {
    const dateStr = req.query.date as string;
    if (!dateStr) {
      return res.status(400).json({ ok: false, message: 'Falta query param date' });
    }
    const fecha = new Date(dateStr);
    const monthStart = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const monthEnd   = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

    const partes = await Parte.find({
      state: 'Finalizado',
      date: { $gte: monthStart, $lte: monthEnd }
    }).exec();

    res.json({ ok: true, partes });
  } catch (err) {
    res.status(500).json({ ok: false, err });
  }
});

/**
 * GET /partes/:id => obtiene 1 parte
 * (GENÉRICA) - DEBE APARECER DESPUÉS de los endpoints específicos
 */
parteRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const parte = await Parte.findById(req.params.id)
        .populate({
          path: 'customer',
          populate: { path: 'zone' }
        }).exec();
    if (!parte) {
      return res.status(404).json({ ok: false, message: 'Parte no encontrada' });
    }
    res.json({ ok: true, parte });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener parte', err });
  }
});

/**
 * DELETE /partes/:id => elimina un parte
 * (GENÉRICA) - TAMBIÉN DEBE APARECER DESPUÉS de endpoints específicos
 */
parteRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const parteDeleted = await Parte.findByIdAndDelete(req.params.id);
    if (!parteDeleted) {
      return res.status(404).json({ ok: false, message: 'No encontrado' });
    }
    res.json({ ok: true, parte: parteDeleted });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar parte', err });
  }
});

/**
 * POST /partes/upload => subir archivos
 */
parteRoutes.post('/upload', [verificarToken], async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      msg: 'No se ha subido ningun archivo!!!'
    });
  }
  const file: FileUpload = req.files.archivo;
  if (!file) {
    return res.status(400).json({
      ok: false,
      file: req.file,
      msg: 'No se ha subido ningun archivo2'
    });
  }
  const carpeta = 'partes';
  const nombres = await fileSystem.guardarFileTemp(file, carpeta, req.user._id);
  return res.json({ ok: true, nombres });
});




export default parteRoutes;
