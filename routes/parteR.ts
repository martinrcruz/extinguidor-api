import { Router, Response, Request } from 'express';
import { verificarToken } from '../middlewares/autenticacion';
import { IParte, Parte } from '../models/parte.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';
import { DocumentParte } from '../models/documentsParte.model';
import { startOfMonth, endOfMonth } from 'date-fns';
import { validarDatos } from '../middlewares/validacion';
import { verificarPropietarioParte } from '../middlewares/verificar-propietario';
import { Customer } from '../models/customers.model';

const parteRoutes = Router();
const fileSystem = new FileSystem();

// Middleware de validación para creación de partes
const validarCreacionParte = validarDatos({
    title: { type: 'string', required: true, maxLength: 200 },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    customer: { type: 'string', required: true },
    address: { type: 'string', required: true },
    state: { type: 'string', enum: ['Pendiente', 'EnProceso', 'Finalizado'] },
    type: { type: 'string', enum: ['Obra', 'Mantenimiento', 'Correctivo', 'Visitas'] },
    categoria: { type: 'string', enum: ['Extintores', 'Incendio', 'Robo', 'CCTV', 'Pasiva', 'Venta'] },
    facturacion: { type: 'number' },
    ruta: { type: 'string' },
    coordinationMethod: { type: 'string', enum: ['Llamar antes', 'Coordinar por email', 'Coordinar según horarios'] },
    gestiona: { type: 'number' },
    periodico: { type: 'boolean' },
    frequency: { type: 'string', enum: ['Mensual', 'Trimestral', 'Semestral', 'Anual'] },
    endDate: { type: 'date' },
    articulos: { type: 'array' }
});

/**
 * GET /partes => lista todas, populando "customer" y "ruta"
 */
parteRoutes.get('/', verificarToken, async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [partes, total] = await Promise.all([
            Parte.find()
                .populate('customer')
                .populate('ruta')
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: -1 }) // Orden descendente por fecha de creación
                .exec(),
            Parte.countDocuments()
        ]);

        res.json({ 
            ok: true, 
            data: {
                partes,
                total,
                page,
                limit
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener partes',
            message: error.message
        });
    }
});

/**
 * POST /partes/create => crea un parte.
 * Si periodico=true, genera múltiples partes.
 * Se fuerza day=1 en la fecha para manejar mes/año.
 */
parteRoutes.post('/create', [verificarToken, validarCreacionParte], async (req: any, res: Response) => {
  try {
    console.log('===========================');
    console.log('CREAR PARTE - DESPUÉS de validación');
    console.log('Body recibido:', JSON.stringify(req.body, null, 2));
    const data = req.body;
    console.log('Paso 1: Verificando documentos');
    // Documentos (opc.)
    const documentsParte = data.docs;
    delete data.docs;

    console.log('Paso 2: Buscando cliente:', data.customer);
    // Verificar si el cliente existe y está activo
    const customer = await Customer.findById(data.customer);
    console.log('Cliente encontrado:', customer ? 'SÍ' : 'NO');
    
    if (!customer) {
      console.log('ERROR: Cliente no encontrado');
      return res.status(404).json({
        ok: false,
        error: 'Cliente no encontrado',
        message: 'Cliente no encontrado'
      });
    }
    
    console.log('Cliente activo:', customer.active);
    // Verificar si el cliente está activo (por defecto true si no existe)
    if (customer.active === false) {
      console.log('ERROR: Cliente inactivo');
      return res.status(400).json({
        ok: false,
        error: 'Cliente inactivo',
        message: 'El cliente está inactivo'
      });
    }

    console.log('Paso 3: Verificando fecha:', data.date);
    // Verificar y forzar day=1 en la fecha. No anterior al mes actual
    const fecha = new Date(data.date);
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    console.log('Fecha parseada:', fecha);
    console.log('Primer día del mes:', firstOfMonth);
    
    if (fecha < firstOfMonth) {
      console.log('ERROR: Fecha anterior al mes actual');
      return res.status(400).json({
        ok: false,
        error: 'Fecha inválida',
        message: 'La fecha no puede ser anterior al mes actual'
      });
    }
    fecha.setDate(1);
    data.date = fecha;
    console.log('Fecha ajustada al día 1:', data.date);

    console.log('Paso 4: Verificando solapamientos para periódicos');
    // Verificar solapamiento de fechas para partes periódicos
    if (data.periodico && data.endDate) {
      const fechaFin = new Date(data.endDate);
      const partesExistentes = await Parte.find({
        customer: data.customer,
        date: { $gte: fecha, $lte: fechaFin }
      });
      if (partesExistentes.length > 0) {
        console.log('ERROR: Partes solapados');
        return res.status(400).json({
          ok: false,
          error: 'Partes solapados',
          message: 'Existen partes solapados en el período especificado'
        });
      }
    }

    console.log('Paso 5: Verificando si es periódico:', data.periodico);
    // Revisar si es periódico
    if (data.periodico && data.endDate) {
      console.log('Creando parte periódico');
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
      }

      return res.status(201).json({ 
        ok: true, 
        data: { partes: partesGuardadas }
      });
    } else {
      // Caso no periódico
      console.log('Paso 6: Creando parte NO periódico');
      console.log('Datos para crear:', JSON.stringify(data, null, 2));
      
      const parteDB = await Parte.create(data);
      console.log('Parte creado exitosamente:', parteDB._id);
      
      if (documentsParte) {
        for (const doc of documentsParte) {
          await DocumentParte.create({ ...doc, parte: parteDB._id });
        }
      }
      return res.status(201).json({ 
        ok: true, 
        data: { parte: parteDB }
      });
    }
  } catch (err: any) {
    console.error('===========================');
    console.error('ERROR AL CREAR PARTE');
    console.error('Error completo:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('===========================');
    res.status(500).json({ 
      ok: false,
      error: 'Error al crear parte',
      message: err.message
    });
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
// routes/parte.routes.ts
/** POST /partes/update                  – body._id   */
parteRoutes.post('/update', actualizarParte);

/** POST /partes/update/:id              – params.id  */
parteRoutes.post('/update/:id', (req, res, next) => {
    req.body._id = req.params.id;   // redirigimos al mismo handler
    actualizarParte(req, res);
});

async function actualizarParte(req: any, res: Response) {
    try {
        const idparte = req.body._id;

        /* ─── SANEAR camp­os ObjectId opcionales ─── */
        const objectIdFields = ['ruta', 'customer', 'worker'];   // añade más si los tuvieras
        const $unset: any = {};
        objectIdFields.forEach(f => {
            if (req.body[f] === '' || req.body[f] === null) {
                delete req.body[f];        // evita Cast error
                $unset[f] = '';            // borra la referencia en el doc
            }
        });

        /* Validaciones específicas que ya tenías … */

        const update = Object.keys($unset).length ? { $set: req.body, $unset } : req.body;

        const parteDB = await Parte.findByIdAndUpdate(idparte, update, { new: true });
        if (!parteDB) return res.status(404).json({ ok: false, error: 'Parte no encontrada' });

        res.json({ ok: true, data: parteDB });
    } catch (err: any) {
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar la parte',
            message: err.message
        });
    }
}

/**
 * GET /partes/noAsignadosEnMes?date=YYYY-MM-DD
 * Muestra partes no asignados hasta el fin del mes especificado
 */
parteRoutes.get('/noAsignadosEnMes', async (req: Request, res: Response) => {
  try {
    const dateStr = req.query.date as string;
    if (!dateStr) {
      return res.status(400).json({ ok: false, message: 'Falta query param date' });
    }
    const fecha = new Date(dateStr);
    const end = endOfMonth(fecha);

    const partes = await Parte.find({
      asignado: false,
      date: { $lte: end }  // Traer todos los partes no asignados hasta el fin del mes especificado
    })
    .populate('customer')
    .populate('ruta')
    .sort({ createdDate: -1 })  // Ordenar por fecha de creación descendente
    .exec();

    res.json({ ok: true, partes });
  } catch (err) {
    console.error('Error GET /partes/noAsignadosEnMes', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener partes no asignados',
      message: err instanceof Error ? err.message : 'Error desconocido'
    });
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
        .sort({ createdDate: -1 }); // Orden descendente por fecha de creación
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
        .sort({ createdDate: -1 }); // Orden descendente por fecha de creación
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
    .sort({ createdDate: -1 }); // Orden descendente por fecha de creación

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
    .sort({ createdDate: -1 }); // Orden descendente por fecha de creación

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
    .sort({ createdDate: -1 }); // Orden descendente por fecha de creación

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
    .sort({ createdDate: -1 }); // Orden descendente por fecha de creación

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
 * POST /partes/upload => Sube un documento a un parte
 */
parteRoutes.post('/upload', [verificarToken, verificarPropietarioParte], async (req: any, res: Response) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No se ha subido ningún archivo'
            });
        }

        const file = req.files.file as FileUpload;
        if (!file || !file.mimetype || !file.size) {
            return res.status(400).json({
                ok: false,
                message: 'Archivo inválido'
            });
        }

        const parteId = req.body.parteId;
        if (!parteId) {
            return res.status(400).json({
                ok: false,
                message: 'ID de parte no proporcionado'
            });
        }

        // Validar tipo de archivo
        const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!tiposPermitidos.includes(file.mimetype)) {
            return res.status(400).json({
                ok: false,
                message: 'Tipo de archivo no permitido. Solo se permiten imágenes y PDFs'
            });
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (Number(file.size) > maxSize) {
            return res.status(400).json({
                ok: false,
                message: 'El archivo excede el tamaño máximo permitido (5MB)'
            });
        }

        // Verificar si el parte existe
        const parte = await Parte.findById(parteId);
        if (!parte) {
            return res.status(404).json({
                ok: false,
                message: 'Parte no encontrado'
            });
        }

        // Guardar archivo
        const fileName = await fileSystem.guardarFileTemp(file, 'partes', req.usuario._id);
        if (!fileName) {
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar el archivo'
            });
        }

        // Crear documento en la base de datos
        const documento = await DocumentParte.create({
            nombre: file.name,
            url: fileName,
            tipo: file.mimetype,
            parte: parteId
        });

        res.json({
            ok: true,
            documento
        });

    } catch (err) {
        console.error('Error al subir archivo =>', err);
        res.status(500).json({
            ok: false,
            message: 'Error al subir archivo',
            err
        });
    }
});

/**
 * DELETE /partes/documento/:id => Elimina un documento
 */
parteRoutes.delete('/documento/:id', [verificarToken, verificarPropietarioParte], async (req: any, res: Response) => {
    try {
        const documentoId = req.params.id;
        const documento = await DocumentParte.findById(documentoId);
        
        if (!documento) {
            return res.status(404).json({
                ok: false,
                message: 'Documento no encontrado'
            });
        }

        // Eliminar archivo físico
        await fileSystem.eliminarFileTemp(documento.url, 'partes');

        // Eliminar documento de la base de datos
        await DocumentParte.findByIdAndDelete(documentoId);

        res.json({
            ok: true,
            message: 'Documento eliminado correctamente'
        });

    } catch (err) {
        console.error('Error al eliminar documento =>', err);
        res.status(500).json({
            ok: false,
            message: 'Error al eliminar documento',
            err
        });
    }
});

/**
 * GET /partes/worker/:workerId
 * Obtiene los partes asignados a un trabajador específico
 */
parteRoutes.get('/worker/:workerId', verificarToken, async (req: Request, res: Response) => {
  try {
    const { workerId } = req.params;
    const { date } = req.query;

    let query: any = { worker: workerId };
    
    if (date) {
      const fecha = new Date(date as string);
      const start = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const end = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      query.date = { $gte: start, $lte: end };
    }

    // Establecer cabeceras de caché para optimizar las peticiones frecuentes
    // 60 segundos de caché para reducir peticiones repetidas
    res.setHeader('Cache-Control', 'private, max-age=60');
    
    // Generar un ETag basado en la fecha de la solicitud para control de caché
    // Esto permite al cliente usar If-None-Match en solicitudes posteriores
    const requestTime = new Date().getTime();
    const etag = `W/"worker-partes-${workerId}-${requestTime}"`;
    res.setHeader('ETag', etag);

    const partes = await Parte.find(query)
      .populate('customer')
      .populate('ruta')
      .sort({ createdDate: -1 }) // Orden descendente por fecha de creación
      .exec();
    
    res.json({ ok: true, partes });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * PUT /partes/:id/status
 * Actualiza el estado de un parte, verificando que pertenezca al trabajador
 */
parteRoutes.put('/:id/status', verificarToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.usuario._id;

    // Validar si el estado es válido
    const validStatus = ['Pendiente', 'EnProceso', 'Finalizado'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Estado inválido',
        message: 'El estado debe ser uno de los siguientes: Pendiente, EnProceso, Finalizado'
      });
    }

    // Verificar que el parte pertenece al worker
    const parte = await Parte.findOne({ _id: id, worker: userId });
    if (!parte) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Parte no encontrado o no tienes permisos para modificarlo'
      });
    }

    // Si el estado actual ya es el que se quiere asignar, no hacer nada
    // Esto actúa como debouncing en el servidor para peticiones duplicadas
    if (parte.state === status) {
      return res.json({ 
        ok: true, 
        parte, 
        message: 'El estado ya está actualizado'
      });
    }

    // Actualizar el estado
    parte.state = status;
    
    // Si el estado es Finalizado, guardar la fecha de finalización
    if (status === 'Finalizado') {
      parte.finalizadoTime = new Date();
    }

    await parte.save();
    
    // Establecer encabezado de caché para prevenir solicitudes repetidas
    res.setHeader('Cache-Control', 'private, max-age=10');

    res.json({ ok: true, parte });
  } catch (error: any) {
    console.error('Error al actualizar estado de parte:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al actualizar el estado',
      message: error.message
    });
  }
});

/**
 * GET /calendario/:date/partes-no-asignados
 * Obtiene los partes no asignados hasta el fin del mes especificado
 * Formato fecha: YYYY-MM-DD (se usa solo año y mes)
 */
parteRoutes.get('/calendario/:date/partes-no-asignados', verificarToken, async (req: Request, res: Response) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Formato de fecha inválido',
        message: 'El formato de fecha debe ser YYYY-MM-DD'
      });
    }
    
    // Obtener solo el fin del mes, ya que queremos todos los partes hasta esa fecha
    const end = endOfMonth(date);
    
    // Buscar partes no asignados hasta el fin del mes especificado
    const partes = await Parte.find({
      date: { $lte: end },
      asignado: false
    })
    .populate('customer')
    .sort({ createdDate: -1 }) // Orden descendente por fecha de creación
    .exec();
    
    res.json({ 
      ok: true, 
      partes
    });
  } catch (error: any) {
    console.error('Error en GET /calendario/:date/partes-no-asignados =>', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener partes no asignados',
      message: error.message
    });
  }
});

/**
 * GET /calendario/:date/partes-finalizados
 * Obtiene los partes finalizados para un mes específico (para mostrar facturación)
 * Formato fecha: YYYY-MM-DD (se usa solo año y mes)
 */
parteRoutes.get('/calendario/:date/partes-finalizados', verificarToken, async (req: Request, res: Response) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Formato de fecha inválido',
        message: 'El formato de fecha debe ser YYYY-MM-DD'
      });
    }
    
    // Obtener inicio y fin del mes
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    // Buscar partes finalizados (estado=finalizado) en ese rango de fecha
    const partes = await Parte.find({
      date: { $gte: start, $lte: end },
      state: 'Finalizado'
    })
    .select('date facturacion customer')
    .populate('customer', 'name')
    .sort({ createdDate: -1 }) // Orden descendente por fecha de creación
    .exec();
    
    res.json({ 
      ok: true, 
      partes
    });
  } catch (error: any) {
    console.error('Error en GET /calendario/:date/partes-finalizados =>', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener partes finalizados',
      message: error.message
    });
  }
});

/**
 * GET /calendario/:date/rutas
 * Obtiene las rutas programadas para una fecha específica
 * Formato fecha: YYYY-MM-DD
 */
parteRoutes.get('/calendario/:date/rutas', verificarToken, async (req: Request, res: Response) => {
  try {
    const dateStr = req.params.date;
    
    // Validar formato de fecha
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Formato de fecha inválido',
        message: 'El formato de fecha debe ser YYYY-MM-DD'
      });
    }
    
    // Llamar a otro servicio para obtener las rutas por fecha
    // Esto aprovecha el endpoint existente en rutaR.ts
    const response = await fetch(`${req.protocol}://${req.get('host')}/rutas/porFecha/${dateStr}`, {
      headers: {
        'x-token': req.header('x-token') || '',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    // Devolver el mismo formato de respuesta
    if (data.ok) {
      res.json({ 
        ok: true, 
        rutas: data.rutas 
      });
    } else {
      throw new Error(data.error || 'Error al obtener rutas');
    }
  } catch (error: any) {
    console.error('Error en GET /calendario/:date/rutas =>', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener rutas por fecha',
      message: error.message
    });
  }
});

export default parteRoutes;
