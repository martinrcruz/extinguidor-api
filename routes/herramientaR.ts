import { Router, Request, Response } from 'express';
import { Herramienta } from '../models/herramienta.model';
import { verificarToken } from '../middlewares/autenticacion';

const herramientaRoutes = Router();

/**
 * GET /herramientas
 * Obtener todas las herramientas.
 */
herramientaRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const herramientas = await Herramienta.find();
        res.json({
            ok: true,
            herramientas
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al obtener las herramientas', error });
    }
});

/**
 * GET /herramientas/:id
 * Obtener una herramienta por su ID.
 */
herramientaRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const herramienta = await Herramienta.findById(id);
        if (!herramienta) {
            return res.status(404).json({ ok: false, message: 'Herramienta no encontrada' });
        }
        res.json({ ok: true, herramienta });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al obtener la herramienta', error });
    }
});

/**
 * POST /herramientas/create
 * Crear una nueva herramienta.
 * Reglas de negocio:
 *  - El campo "name" es obligatorio y único.
 *  - El campo "description" es obligatorio.
 */
herramientaRoutes.post('/create', verificarToken, async (req: Request, res: Response) => {
    const body = req.body;

    // Validar campos requeridos
    if (!body.name) {
        return res.status(400).json({ ok: false, message: 'El nombre es obligatorio' });
    }
    if (!body.description) {
        return res.status(400).json({ ok: false, message: 'La descripción es obligatoria' });
    }

    try {
        const herramienta = new Herramienta({
            name: body.name,
            description: body.description,
            // Agrega aquí otros campos si son necesarios
        });
        const herramientaDB = await herramienta.save();
        res.status(201).json({
            ok: true,
            herramienta: herramientaDB,
            message: 'Herramienta creada exitosamente'
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ ok: false, message: 'El nombre de la herramienta ya existe' });
        }
        res.status(500).json({ ok: false, message: 'Error al crear la herramienta', error });
    }
});

/**
 * PUT /herramientas/update/:id
 * Actualizar una herramienta existente.
 * Reglas de negocio:
 *  - No se permite actualizar el nombre a uno que ya exista.
 *  - Se deben cumplir las validaciones definidas en el modelo.
 */
herramientaRoutes.put('/update/:id', verificarToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    try {
        // Si se intenta actualizar el nombre, verificar que no exista otra herramienta con ese nombre.
        if (body.name) {
            const duplicate = await Herramienta.findOne({ name: body.name, _id: { $ne: id } });
            if (duplicate) {
                return res.status(400).json({ ok: false, message: 'El nombre de la herramienta ya está en uso' });
            }
        }

        const herramientaUpdated = await Herramienta.findByIdAndUpdate(id, body, { new: true });
        if (!herramientaUpdated) {
            return res.status(404).json({ ok: false, message: 'Herramienta no encontrada' });
        }
        res.json({
            ok: true,
            herramienta: herramientaUpdated,
            message: 'Herramienta actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al actualizar la herramienta', error });
    }
});

/**
 * DELETE /herramientas/:id
 * Eliminar una herramienta.
 */
herramientaRoutes.delete('/:id', verificarToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const herramientaDeleted = await Herramienta.findByIdAndDelete(id);
        if (!herramientaDeleted) {
            return res.status(404).json({ ok: false, message: 'Herramienta no encontrada' });
        }
        res.json({
            ok: true,
            herramienta: herramientaDeleted,
            message: 'Herramienta eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al eliminar la herramienta', error });
    }
});

export default herramientaRoutes;
