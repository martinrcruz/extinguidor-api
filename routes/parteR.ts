import { Router, Response, Request } from 'express';
import { IRuta, Ruta } from '../models/rutas.model';
import { verificarToken } from '../middlewares/autenticacion';
import { IParte, Parte } from '../models/parte.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system'


const parteRoutes = Router();
const fileSystem = new FileSystem();


parteRoutes.get('/prueba', (req: Request, res: Response) => {

  res.json({
    ok: true,
    mje: 'todo ok'
  })
});

parteRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
  const parte: IParte = req.body;
  const programado = Number(req.body.programado);
  const duracion = Number(req.body.duracion) * 12;
  const documentsParte = req.body.doc
  let suma = 0;
  
  const repetir = req.body.rep;

  if (repetir) {
    try {

      let fechaActual = new Date(parte.date);
      let partesGuardadas: any[] = [];
      

      const nuevoParte = { ...parte, date: new Date(fechaActual) };
      const parteDB = await Parte.create(nuevoParte);
      for (let i = 0; i < documentsParte.length; i++){
        const nuevoDoc = { ...documentsParte[i], parte: parteDB._id };
        
      }
      
      partesGuardadas.push(parteDB)

      while (suma < duracion) {
        fechaActual.setMonth(fechaActual.getMonth() + programado);
        const nuevoParte = { ...parte, date: new Date(fechaActual) };
        const parteDB = await Parte.create(nuevoParte);
        for (let i = 0; i < documentsParte.length; i++){
          const nuevoDoc = { ...documentsParte[i], parte: parteDB._id };
         
        }
        partesGuardadas.push(parteDB)
        suma = suma + programado



      }

      if (suma >= duracion) {
        res.status(201).json({
          ok: true,
          partes: partesGuardadas,
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al crear partes', err });
    }





  } else {
    try {
      const parteDB = await Parte.create(parte);
      for (let i = 0; i < documentsParte.length; i++){
        const nuevoDoc = { ...documentsParte[i], parte: parteDB._id };
        
      }
      res.status(201).json({
        ok: true,
        parte: parteDB
      });
    } catch (err) {
      res.status(500).json({ message: 'Error al crear parte', err });
    }

  }


});


//actializar
parteRoutes.post('/update', async (req: any, res: Response) => {
  const idparte = req.body._id
  const updatedParteData: IParte = req.body;
  console.log(updatedParteData);
  try {
    const parteDB = await Parte.findByIdAndUpdate(idparte, updatedParteData, { new: true });
    if (!parteDB) {
      return res.status(404).json({ message: 'Parte no encontrada' });
    }
    res.status(200).json({
      ok: true,
      parte: parteDB
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la parte', err });
  }
});


parteRoutes.delete('/:id', async (req: Request, res: Response) => {

});

parteRoutes.get('/', async (req: Request, res: Response) => {

  try {
    const partes: IParte[] = await Parte.find().populate('customer').populate('zone').populate('ruta');

    res.json({
      ok: true,
      partes: partes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});
parteRoutes.get('/ruta/:ruta', async (req: Request, res: Response) => {
  const ruta = req.params.ruta

  try {
    const partes: IParte[] = await Parte.find({ ruta: ruta }).populate('customer').populate('zone');
    res.json({
      ok: true,
      partes: partes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los rutas', error });
  }
});

parteRoutes.get('/noasignados/', async (req: Request, res: Response) => {

  const fechaInicio = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaInicio.getDate() + 30);
  fechaInicio.setDate(fechaInicio.getDate() - 360);
  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}`;
  const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}`;
  const asignado = false;
  try {
    const partes: IParte[] = await Parte.find({
      asignado: asignado,
      date:
      {
        $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate('customer').populate('zone');
    res.json({
      ok: true,
      partes: partes,

    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});
parteRoutes.get('/noasignado/:fecha', async (req: Request, res: Response) => {

  const fecha = new Date(req.params.fecha)
  const fechaInicio = new Date();
  const noasignado = false;
  fechaInicio.setDate(fecha.getDate() - 365);
  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}`;
  const formattedEndDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
  console.log(fecha)
  console.log(formattedEndDate)
  try {
    const partes: IParte[] = await Parte.find({
      asignado: noasignado,
      date: {
        $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate('customer').populate('zone');
    res.json({
      ok: true,
      partes: partes,

    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});

parteRoutes.get('/asignado/', async (req: Request, res: Response) => {

  const fechaInicio = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaInicio.getDate() + 30);
  const formattedStartDate = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
  const formattedEndDate = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;
  const asignado = true;
  try {
    const partes: IParte[] = await Parte.find({
      asignado: asignado,
      date:
      {
        $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    }).populate('customer').populate('zone').populate('ruta');
    res.json({
      ok: true,
      partes: partes,

    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los partes', error });
  }
});


//subir archivos
parteRoutes.post('/upload',[verificarToken], async (req:any, res:Response)=>{
  if(!req.files){
    return res.status(400).json({
      ok:false,
      msg:'No se ha subido ningun archivo'
    })
  }
  const file: FileUpload= req.files.archivo
  if(!file){
    return res.status(400).json({
      ok:false,
      msg:'No se ha subido ningun archivo'
    })
  }
  const carpeta= 'partes'
  await fileSystem.guardarFileTemp(file, carpeta, req.user._id);

  return res.json({
    ok:true,
    file: file
  })

  
})


export default parteRoutes;