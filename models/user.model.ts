import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  
  name: {
    type: String,
    
    required: [true, 'nombre de usuario requerido']
  },
  code: {
    type: String,
    unique: true,
    required: [true, '']
  },
  photo: {
    type: String,
    quired:[true,''],
    default: "https://ionicframework.com/docs/img/demos/avatar.svg"
  },
  role:{
    type: String,
    enum:["worker", "admin"],
    required:[true,''],
    
  },
  email: {
    type: String,
    unique: [true, 'email ya registrado'],
    required: [true, 'Ingresa un email válido']
  },
  phone:{  
    type: String,
    unique: [true, 'numero ya registrado'],
    required: [true, 'El número es obligatorio']
  },
  password: {
    type: String,
    required: [true, 'Ingresa una contraseña'],
    select: false 
  },
  activo: {
    type: Boolean,
    default: true,
    required: [true, 'Usuario no autorizado']
  },
  junior: {
    type: Boolean,
    default: true,
    required: [true, 'el usuario es junior']
  },

});

userSchema.methods.compararPassword = function(password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

export interface IUser extends Document {
  name:       string;
  code:       string;
  photo:      string;
  role:       string;
  email:      string;
  password:   string;
  phone:      string;
  activo:     boolean;
  junior:     boolean;
  
  compararPassword(password: string): boolean;
}

export const User = model<IUser>('User', userSchema);