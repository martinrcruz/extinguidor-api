import { Router, Response, Request } from 'express';
import { ICustomer, Customer } from '../models/customers.model';
import { verificarToken } from '../middlewares/autenticacion';

const customerRouter = Router();


customerRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

customerRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const customer: ICustomer = req.body
        try {
            const customerDB = await Customer.create(customer);
            res.status(201).json({
              ok: true,
              customer: customerDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
customerRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un scustomer por su ID
customerRouter.delete('/:id', async (req: Request, res: Response) => {
 
});

customerRouter.get('/', async (req: Request, res: Response) => {
  try {
      const customers: ICustomer[] = await Customer.find();
      res.json({
          ok: true,
          customers: customers
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener customers', error });
  }
});