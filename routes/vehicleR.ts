import { Router, Response, Request } from 'express';
import { IVehicle, Vehicle } from '../models/vehicle.model';
import { verificarToken } from '../middlewares/autenticacion';

const vehicleRoutes = Router();


vehicleRoutes.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

vehicleRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
        const vehicle: IVehicle = req.body
        try {
            const vehicleDB = await Vehicle.create(vehicle);
            res.status(201).json({
              ok: true,
              vehicle: vehicleDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});


//actializar
vehicleRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un vehicle por su ID
vehicleRoutes.delete('/:id', async (req: Request, res: Response) => {
 
});


//obtener vehicles
vehicleRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const vehicles: IVehicle[] = await Vehicle.find();
        res.json({
            ok: true,
            vehicles: vehicles
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los vehicles', error });
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
                vehicle: vehicle
            });
        } else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
});


export default vehicleRoutes;