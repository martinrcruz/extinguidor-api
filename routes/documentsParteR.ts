import { Router, Response, Request } from 'express';
import { IDocumentParte, DocumentParte } from '../models/documentsParte.model';
import { verificarToken } from '../middlewares/autenticacion';

const documentsparteRouter = Router();


documentsparteRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

documentsparteRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const documentsparte: IDocumentParte = req.body
        try {
            const documentsparteDB = await DocumentParte.create(documentsparte);
            res.status(201).json({
              ok: true,
              documentsparte: documentsparteDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
documentsparteRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Documentsparte por su ID
documentsparteRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

documentsparteRouter.get('/', async (req: Request, res: Response) => {
  try {
      const documentspartes: IDocumentParte[] = await DocumentParte.find();
      res.json({
          ok: true,
          documentspartes: documentspartes
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los documentos', error });
  }
});