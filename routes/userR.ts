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
    console.log(req.body)
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
                tokenU: tokenUser,
                role: userDB.role
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


userRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
    const id = req.body._id;

    // Clonamos los datos enviados en el body
    const datosActualizados: any = { ...req.body };

    // Eliminamos campos inmutables
    delete datosActualizados._id;

    // Si se envía nueva contraseña, la encriptamos
    if (datosActualizados.password) {
        datosActualizados.password = bcrypt.hashSync(datosActualizados.password, 10);
    }

    try {
        // Obtenemos el usuario actual desde la BD
        const currentUser = await User.findById(id);

        console.log(currentUser!.email);
        console.log(datosActualizados.email);

        // Validamos el email solo si se envía y es distinto al correo actual del usuario en BD
        if (datosActualizados.email && currentUser && datosActualizados.email !== currentUser.email) {
            const duplicate = await User.findOne({ email: datosActualizados.email, _id: { $ne: id } });
            if (duplicate) {
                return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
            }
        }

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
            });
            res.status(201).json({
                ok: true,
                tokenU: tokenUser
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el evento', error });
    }
});




// Ruta para eliminar un user por su ID



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
//obtener users
userRoutes.get('/worker', async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find({ role: 'worker' });
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
