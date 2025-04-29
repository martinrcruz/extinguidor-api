import { Router, Response, Request } from 'express';
import { IVehicle, Vehicle } from '../models/vehicle.model';
import { verificarToken } from '../middlewares/autenticacion';

const vehicleRoutes = Router();


vehicleRoutes.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

vehicleRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    const vehicle: IVehicle = req.body
    try {
        const vehicleDB = await Vehicle.create(vehicle);
        res.status(201).json({
            ok: true,
            data: { vehicle: vehicleDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear vehículo',
            message: err.message
        });
    }
});


//actializar
vehicleRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({ 
                ok: false,
                error: 'ID no proporcionado',
                message: 'Se requiere el ID del vehículo'
            });
        }
        
        const updated = await Vehicle.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ 
                ok: false,
                error: 'Vehículo no encontrado',
                message: 'Vehículo no encontrado'
            });
        }
        
        res.json({ 
            ok: true, 
            data: { vehicle: updated }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al actualizar vehículo',
            message: err.message
        });
    }
});

// Ruta para eliminar un vehicle por su ID
vehicleRoutes.delete('/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Vehicle.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ 
                ok: false,
                error: 'Vehículo no encontrado',
                message: 'Vehículo no encontrado'
            });
        }
        
        res.json({ 
            ok: true, 
            data: { message: 'Vehículo eliminado correctamente' }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al eliminar vehículo',
            message: err.message
        });
    }
});


//obtener vehicles
vehicleRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const vehicles: IVehicle[] = await Vehicle.find();
        res.json({
            ok: true,
            data: { vehicles }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener vehículos',
            message: error.message
        });
    }
});

// Ruta para obtener un vehicle
vehicleRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const vehicle: IVehicle | null = await Vehicle.findById(id);
        if (vehicle) {
            res.json({
                ok: true,
                data: { vehicle }
            });
        } else {
            res.status(404).json({ 
                ok: false,
                error: 'Vehículo no encontrado',
                message: 'Vehículo no encontrado'
            });
        }
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener vehículo',
            message: error.message
        });
    }
});


export default vehicleRoutes;