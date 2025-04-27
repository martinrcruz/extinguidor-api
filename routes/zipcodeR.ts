import { Router, Response, Request } from 'express';
import { IZipcode, Zipcode } from '../models/zipcode.model';
import { verificarToken } from '../middlewares/autenticacion';

const zipcodeRouter = Router();


zipcodeRouter.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

zipcodeRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
    const zipcode: IZipcode = req.body
    try {
        const zipcodeDB = await Zipcode.create(zipcode);
        res.status(201).json({
            ok: true,
            data: { zipcode: zipcodeDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear código postal',
            message: err.message
        });
    }
});


//actializar
zipcodeRouter.put('/update', verificarToken, async (req: any, res: Response) => {
});

// Ruta para eliminar un Zipcode por su ID
zipcodeRouter.delete('/:id', async (req: Request, res: Response) => {
 
});


//obtener Zipcodes
zipcodeRouter.get('/', async (req: Request, res: Response) => {
    try {
        const zipcodes: IZipcode[] = await Zipcode.find();
        res.json({
            ok: true,
            data: { zipcodes }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener códigos postales',
            message: error.message
        });
    }
});

// Ruta para obtener un código postal específico
zipcodeRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const zipcode: IZipcode | null = await Zipcode.findById(id);
        if (!zipcode) {
            return res.status(404).json({
                ok: false,
                error: 'Código postal no encontrado',
                message: 'Código postal no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { zipcode }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener código postal',
            message: error.message
        });
    }
});