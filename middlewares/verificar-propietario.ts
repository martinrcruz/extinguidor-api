import { Response, NextFunction } from 'express';
import { Parte } from '../models/parte.model';
import { Ruta } from '../models/rutas.model';
import { User } from '../models/user.model';

export const verificarPropietarioParte = async (req: any, res: Response, next: NextFunction) => {
  try {
    const parteId = req.params.id;
    const userId = req.usuario._id;

    // Verificar si el usuario está activo
    const user = await User.findById(userId);
    if (!user || !user.activo) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Usuario inactivo o no encontrado' 
      });
    }

    // Verificar si el usuario tiene permisos de administrador
    if (user.role === 'admin') {
      return next();
    }

    const parte = await Parte.findById(parteId);
    if (!parte) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Parte no encontrado' 
      });
    }

    // Si el parte no tiene ruta asignada, solo los administradores pueden modificarlo
    if (!parte.ruta) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Solo los administradores pueden modificar partes sin ruta asignada' 
      });
    }

    // Verificar que el parte pertenece a una ruta del usuario
    const ruta = await Ruta.findOne({
      _id: parte.ruta,
      users: userId,
      active: true
    });

    if (!ruta) {
      return res.status(403).json({ 
        ok: false, 
        error: 'No autorizado para modificar este parte' 
      });
    }

    // Verificar si el usuario tiene permisos específicos para la ruta
    const userRuta = ruta.users?.find(u => u.toString() === userId.toString());
    if (!userRuta) {
      return res.status(403).json({ 
        ok: false, 
        error: 'No tienes permisos para esta ruta' 
      });
    }

    // Agregar información útil al request
    req.parte = parte;
    req.ruta = ruta;

    next();
  } catch (error: any) {
    console.error('Error en verificarPropietarioParte:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al verificar permisos del parte' 
    });
  }
}; 