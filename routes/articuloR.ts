import { Router } from 'express';

import Articulo from '../models/articulo.model';
import { verificarToken } from '../middlewares/autenticacion';

const router = Router();

// Obtener todos los artículos
router.get('/', verificarToken, async (req, res) => {
  try {
    const articulos = await Articulo.find({ eliminado: false });
    res.json({
      ok: true,
      articulos
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