import { object, string, type InferType } from 'yup';

export const loginSchema = object({
  email: string()
    .email('Ingresa un email válido')
    .required('El email es requerido')
    .trim()
    .lowercase(),

  password: string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es requerida'),
});

export type LoginFormValues = InferType<typeof loginSchema>;
