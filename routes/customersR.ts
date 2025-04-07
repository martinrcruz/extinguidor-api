import { Router, Response, Request } from 'express';
import { ICustomer, Customer } from '../models/customers.model';
import { verificarToken } from '../middlewares/autenticacion';

const customerRoutes = Router();


customerRoutes.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

customerRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    try {
        const data: ICustomer = req.body;
        // data.MI? data.tipo? (se guardan tal cual)

        const customerDB = await Customer.create(data);
        res.status(201).json({
            ok: true,
            customer: customerDB
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear customer', err });
    }

    
});


//actializar
customerRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
    try {
        const { _id } = req.body;
        const updated = await Customer.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
        }
        res.json({ ok: true, customer: updated });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar', err });
    }
});

// Ruta para eliminar un scustomer por su ID
customerRoutes.delete('/:id', async (req: Request, res: Response) => {
 
});

customerRoutes.get('/', async (req: Request, res: Response) => {
  try {
      const customers: ICustomer[] = await Customer.find().populate('zone');
      res.json({
          ok: true,
          customers: customers
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener customers', error });
  }
});

customerRoutes.get('/:id', verificarToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      const customer: ICustomer| null = await Customer.findById(id).populate('zone');
      res.json({
          ok: true,
          customer: customer
      });
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener customers', error });
  }
});

export default customerRoutes;
