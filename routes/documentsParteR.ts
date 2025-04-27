import { Router, Response, Request } from 'express';
import { IDocumentParte, DocumentParte } from '../models/documentsParte.model';
import { verificarToken } from '../middlewares/autenticacion';

const documentsparteRouter = Router();


documentsparteRouter.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        data: { message: 'todo ok' }
    })
});

documentsparteRouter.post('/create', verificarToken, async (req: Request, res: Response) => {
    const documentsparte: IDocumentParte = req.body
    try {
        const documentsparteDB = await DocumentParte.create(documentsparte);
        res.status(201).json({
            ok: true,
            data: { documentsparte: documentsparteDB }
        });
    } catch (err: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al crear documento',
            message: err.message
        });
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
            data: { documentspartes }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener documentos',
            message: error.message
        });
    }
});

// Ruta para obtener un documento específico
documentsparteRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const documentsparte: IDocumentParte | null = await DocumentParte.findById(id);
        if (!documentsparte) {
            return res.status(404).json({
                ok: false,
                error: 'Documento no encontrado',
                message: 'Documento no encontrado'
            });
        }
        res.json({
            ok: true,
            data: { documentsparte }
        });
    } catch (error: any) {
        res.status(500).json({ 
            ok: false,
            error: 'Error al obtener documento',
            message: error.message
        });
    }
});