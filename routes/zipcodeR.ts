import { Router, Response, Request } from 'express';
import { IZipcode, Zipcode } from '../models/zipcode.model';
import { verificarToken } from '../middlewares/autenticacion';

const zipcodeRouter = Router();


zipcodeRouter.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

zipcodeRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
        const zipcode: IZipcode = req.body
        try {
            const zipcodeDB = await Zipcode.create(zipcode);
            res.status(201).json({
              ok: true,
              zipcode: zipcodeDB
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
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
            zipcodes: zipcodes
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Zipcodes', error });
    }
});