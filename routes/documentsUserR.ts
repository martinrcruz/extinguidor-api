import { Router, Response, Request } from 'express';
import { IDocumentUser, DocumentUser } from '../models/documentsUser.model';
import { verificarToken } from '../middlewares/autenticacion';

const documentsuserRouter = Router();


documentsuserRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

documentsuserRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const documentsuser: IDocumentUser = req.body
        try {
            const documentsuserDB = await DocumentUser.create(documentsuser);
            res.status(201).json({
              ok: true,
              documentsuser: documentsuserDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
documentsuserRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Documentsuser por su ID
documentsuserRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

documentsuserRouter.get('/', async (req: Request, res: Response) => {
  try {
      const documentsusers: IDocumentUser[] = await DocumentUser.find();
      res.json({
          ok: true,
          documentsusers: documentsusers
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los documentos', error });
  }
});