import { Router } from 'express';

import Articulo from '../models/articulo.model';
import { verificarToken } from '../middlewares/autenticacion';

const router = Router();

// Obtener todos los artículos con paginación y filtros
router.get('/', verificarToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 100, 
      search = '', 
      grupo = '', 
      familia = '' 
    } = req.query;

    // Convertir a números
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Construir filtros
    const filters: any = { eliminado: false };
    
    // Filtro de búsqueda por texto
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filters.$or = [
        { codigo: searchRegex },
        { descripcionArticulo: searchRegex },
        { grupo: searchRegex },
        { familia: searchRegex }
      ];
    }

    // Filtros específicos
    if (grupo) {
      filters.grupo = { $regex: grupo, $options: 'i' };
    }
    
    if (familia) {
      filters.familia = { $regex: familia, $options: 'i' };
    }

    // Obtener artículos con paginación
    const articulos = await Articulo.find(filters)
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Obtener total de documentos para calcular páginas
    const total = await Articulo.countDocuments(filters);
    const totalPages = Math.ceil(total / limitNumber);

    res.json({
      ok: true,
      articulos,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }
});

// Obtener un artículo por ID
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const articulo = await Articulo.findOne({ _id: req.params.id, eliminado: false });
    if (!articulo) {
      return res.status(404).json({
        ok: false,
        msg: 'Artículo no encontrado'
      });
    }
    res.json({
      ok: true,
      articulo
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }
});

// Crear un nuevo artículo
router.post('/', verificarToken, async (req, res) => {
  try {
    const articulo = new Articulo(req.body);
    await articulo.save();
    res.json({
      ok: true,
      articulo
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }
});

// Actualizar un artículo
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const articulo = await Articulo.findOneAndUpdate(
      { _id: req.params.id, eliminado: false },
      { ...req.body, updatedDate: new Date() },
      { new: true }
    );
    if (!articulo) {
      return res.status(404).json({
        ok: false,
        msg: 'Artículo no encontrado'
      });
    }
    res.json({
      ok: true,
      articulo
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }
});

// Eliminar un artículo (borrado lógico)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const articulo = await Articulo.findOneAndUpdate(
      { _id: req.params.id, eliminado: false },
      { eliminado: true, updatedDate: new Date() },
      { new: true }
    );
    if (!articulo) {
      return res.status(404).json({
        ok: false,
        msg: 'Artículo no encontrado'
      });
    }
    res.json({
      ok: true,
      msg: 'Artículo eliminado'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }
});

export default router; 