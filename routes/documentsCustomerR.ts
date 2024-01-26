import { Router, Response, Request } from 'express';
import { IDocumentCustomer, DocumentCustomer } from '../models/documentsCustomer.model';
import { verificarToken } from '../middlewares/autenticacion';

const documentscustomerRouter = Router();


documentscustomerRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

documentscustomerRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const documentscustomer: IDocumentCustomer = req.body
        try {
            const documentscustomerDB = await DocumentCustomer.create(documentscustomer);
            res.status(201).json({
              ok: true,
              documentscustomer: documentscustomerDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
documentscustomerRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Documentscustomer por su ID
documentscustomerRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

documentscustomerRouter.get('/', async (req: Request, res: Response) => {
  try {
      const documentscustomers: IDocumentCustomer[] = await DocumentCustomer.find();
      res.json({
          ok: true,
          documentscustomers: documentscustomers
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los documentos', error });
  }
});