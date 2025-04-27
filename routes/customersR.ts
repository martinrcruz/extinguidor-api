import { Router, Response, Request } from 'express';
import { ICustomer, Customer } from '../models/customers.model';
import { verificarToken } from '../middlewares/autenticacion';

const customerRoutes = Router();


customerRoutes.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

customerRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    try {
        const data: ICustomer = req.body;
        const customerDB = await Customer.create(data);
        res.status(201).json({
            ok: true,
            data: { customer: customerDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear cliente',
            message: err.message
        });
    }
});


//actializar
customerRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
    try {
        const { _id } = req.body;
        const updated = await Customer.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ 
                ok: false,
                error: 'Cliente no encontrado',
                message: 'Cliente no encontrado'
            });
        }
        res.json({ 
            ok: true, 
            data: { customer: updated }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al actualizar cliente',
            message: err.message
        });
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
            data: { customers }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener clientes',
            message: error.message
        });
    }
});

customerRoutes.get('/:id', verificarToken, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customer: ICustomer| null = await Customer.findById(id).populate('zone');
        if (!customer) {
            return res.status(404).json({
                ok: false,
                error: 'Cliente no encontrado',
                message: 'Cliente no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { customer }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener cliente',
            message: error.message
        });
    }
});

export default customerRoutes;
