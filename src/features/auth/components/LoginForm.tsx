import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../validations/loginSchema';
import { Alert, Button } from '../../../components/common';

export default function LoginForm() {
    const { login, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (values: LoginFormValues) => {
        clearError();
        try {
        await login(values);
        } catch (err) {
        console.error('Error al iniciar sesión:', err);
        }
    };

    return (
        <div className="w-full max-w-md">
        <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
                {/* Logo y Título */}
                <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
                    <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <h2 className="text-3xl font-bold text-base-content">Clínica Médica</h2>
                <p className="text-base-content/60 mt-2">Inicia sesión en tu cuenta</p>
                </div>

                {/* Error General */}
                {error && (
                <Alert type="error" closeable onClose={clearError}>
                    <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                    </div>
                </Alert>
                )}

                {/* Campo Email */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                    </span>
                </label>
                <div className="relative">
                    <Field
                    name="email"
                    type="email"
                    placeholder="doctor@clinica.com"
                    autoComplete="email"
                    className={`input input-bordered w-full pl-10 ${
                        errors.email && touched.email ? 'input-error' : ''
                    }`}
                    />
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                </div>
                <ErrorMessage name="email">
                    {(msg) => (
                    <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {msg}
                        </span>
                    </label>
                    )}
                </ErrorMessage>
                </div>

                {/* Campo Contraseña */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Contraseña
                    </span>
                </label>
                <div className="relative">
                    <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`input input-bordered w-full pl-10 pr-10 ${
                        errors.password && touched.password ? 'input-error' : ''
                    }`}
                    />
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                    tabIndex={-1}
                    >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                    </button>
                </div>
                <ErrorMessage name="password">
                    {(msg) => (
                    <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {msg}
                        </span>
                    </label>
                    )}
                </ErrorMessage>
                </div>

                {/* Recordarme / Olvidé contraseña */}
                <div className="flex items-center justify-between">
                <label className="label cursor-pointer gap-2 p-0">
                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                    <span className="label-text">Recordarme</span>
                </label>
                <a href="#" className="link link-primary text-sm hover:link-hover">
                    ¿Olvidaste tu contraseña?
                </a>
                </div>

                {/* Botón de Login */}
                <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                className='bg-purple-500'
                >
                {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                    </div>
                ) : (
                    <span>Iniciar Sesión</span>
                )}
                </Button>

                {/* Credenciales de Prueba */}
                <div className="mt-6 p-4 bg-base-200 rounded-lg border border-base-300">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-info" />
                    <p className="text-sm font-semibold text-base-content">
                    Credenciales de Prueba
                    </p>
                </div>
                <div className="space-y-2">
                    <div className="text-xs">
                    <span className="font-semibold text-primary">Admin:</span>
                    <p className="text-base-content/70 ml-2">admin@clinica.com / Admin123!</p>
                    </div>
                    <div className="text-xs">
                    <span className="font-semibold text-secondary">Doctor:</span>
                    <p className="text-base-content/70 ml-2">garcia.cardio@clinica.com / Doctor123!</p>
                    </div>
                    <div className="text-xs">
                    <span className="font-semibold text-accent">Paciente:</span>
                    <p className="text-base-content/70 ml-2">juan.perez@email.com / Patient123!</p>
                    </div>
                </div>
                </div>
            </Form>
            )}
        </Formik>
        </div>
    );
}