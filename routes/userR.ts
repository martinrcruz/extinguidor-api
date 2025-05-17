// src/routes/user.routes.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser, User } from '../models/user.model';
import Token from '../classes/token';
import { verificarToken } from '../middlewares/autenticacion';

const userRoutes = Router();

/* ============= CHECK SERVER STATUS ============= */
userRoutes.get('/check-status', (_req: Request, res: Response) => {
    res.json({ ok: true, data: { status: 'online', message: 'Server running correctly' } });
});

/* ============= CREATE ============= */
userRoutes.post('/create', async (req: Request, res: Response) => {
    try {
        const body: IUser = { ...req.body, password: bcrypt.hashSync(req.body.password, 10) };
        const userDB   = await User.create(body);
        // devolvemos el documento recién creado
        res.status(201).json({ ok: true, data: { user: userDB } });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: 'Error al crear usuario', message: err.message });
    }
});

/* ============= LOGIN ============= */
userRoutes.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email }).select('+password');
    if (!userDB) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    if (!userDB.compararPassword(password))
        return res.status(400).json({ ok: false, error: 'Contraseña incorrecta' });

    const token = Token.getJwtToken({
        _id:  userDB._id,
        name: userDB.name,
        code: userDB.code,
        email: userDB.email,
        phone: userDB.phone,
        role: userDB.role
    });

    res.json({ ok: true, data: { token, role: userDB.role } });
});

/* ============= UPDATE ============= */
userRoutes.put('/update', verificarToken, async (req: any, res: Response) => {
    const { _id, ...rest } = req.body;
    const updatePayload: any = { ...rest };

    // evita colisión de e-mail
    if (updatePayload.email) {
        const dup = await User.findOne({ email: updatePayload.email, _id: { $ne: _id } });
        if (dup) return res.status(400).json({ ok: false, error: 'Email ya está en uso' });
    }

    const updated = await User.findByIdAndUpdate(_id, updatePayload, { new: true });
    if (!updated) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    const newToken = Token.getJwtToken({
        _id:  updated._id,
        name: updated.name,
        code: updated.code,
        email: updated.email,
        phone: updated.phone,
        role: updated.role
    });

    res.json({ ok: true, data: { user: updated, token: newToken } });
});

/* ============= DELETE ============= */
userRoutes.delete('/delete/:id', verificarToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const removed = await User.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: { message: 'Usuario eliminado' } });
});

/* ============= READ ============= */
userRoutes.get('/list', async (_req, res) => {
    const users = await User.find();
    res.json({ ok: true, data: { users } });
});

userRoutes.get('/worker', async (_req, res) => {
    const users = await User.find({ role: 'worker' });
    res.json({ ok: true, data: { users } });
});

userRoutes.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: { user } });
});

/* ========= logged-in profile ======= */
userRoutes.get('/', verificarToken, (req: any, res) => {
    res.json({ ok: true, data: { user: req.user } });
});

export default userRoutes;
