import { Router, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { IUser, User } from '../models/user.model';
import Token from '../classes/token';
import { verificarToken } from '../middlewares/autenticacion';

const userRoutes = Router();


userRoutes.get('/prueba', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mje: 'todo ok'
    })
});

userRoutes.post('/create', async (req: Request, res: Response) => {
        const user: IUser = req.body
        user.password = await bcrypt.hashSync(req.body.password, 10);
        try {
            const userDB = await User.create(user);
            res.status(201).json({
              ok: true,
              mje: 'user creado'
            });
          } catch (err) {
            res.status(500).json({ message: 'Error al admin', err });
          }
        
    
});
//login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;
    User.findOne({ email: body.email }).select('+password').then(userDB => {

        if (!userDB) {
            return res.status(500).json({
                ok: false,
                message: 'usuario no encontrado'
            });
        }
        if (userDB?.compararPassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                code: userDB.code,
                email: userDB.email,
                phone: userDB.phone,
                role: userDB.role,
                junior: userDB.junior
            })
            res.status(201).json({
                ok: true,
                tokenU: tokenUser
            });
        } else {
            res.status(500).json({
                ok: false,
                message: 'password no coincide'
            });
        }


    }).catch(err => {
        res.status(500).json({ message: 'Error', err });
    })


})
//actializar
userRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
    const id = req.user._id;
    console.log(req.user._id)
    const datosActualizados: IUser = req.body;
    if (req.body.password) {
        datosActualizados.password = bcrypt.hashSync(req.body.password, 10);
    }

    try {
        const userActualizado: IUser | null = await User.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (userActualizado) {
            const tokenUser = Token.getJwtToken({
                _id:    userActualizado._id,
                name:   userActualizado.name,
                code:   userActualizado.code,
                email:  userActualizado.email,
                phone:  userActualizado.phone,
                role:   userActualizado.role,
                junior: userActualizado.junior
                
            })
            res.status(201).json({
                ok: true,
                tokenU: tokenUser
            })
        } else {
            res.status(404).json({ message: 'no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el evento', error });
    }

});

// Ruta para eliminar un user por su ID
userRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userEliminado: IUser | null = await User.findByIdAndDelete(id);
        if (userEliminado) {
            res.json(userEliminado);
        } else {
            res.status(404).json({ message: 'User no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el evento', error });
    }
});


//obtener users
userRoutes.get('/list', async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find();
        res.json({
            ok: true,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los users', error });
    }
});

// Ruta para obtener un user
userRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user: IUser | null = await User.findById(id);
        if (user) {
            res.json({
                ok: true,
                user: user
            });
        } else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
});

userRoutes.get('/', [verificarToken], (req: any, res: Response) => {
    const user = req.user;

    res.json({ 
        ok: true,
        user
    });
})



export default userRoutes;