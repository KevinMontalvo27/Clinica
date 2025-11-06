// src/features/auth/pages/LoginPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, Calendar, Users } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Panel Izquierdo - Información */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-secondary p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6" fill="white" />
            </div>
            <h1 className="text-2xl font-bold">Clínica Médica</h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">
              Sistema de Gestión Médica
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Administra citas, pacientes y servicios médicos de forma eficiente y segura.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Gestión de Citas</h3>
                  <p className="text-white/70 text-sm">
                    Agenda y administra citas médicas fácilmente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Control de Pacientes</h3>
                  <p className="text-white/70 text-sm">
                    Historial médico completo y organizado
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Especialidades Médicas</h3>
                  <p className="text-white/70 text-sm">
                    Múltiples especialidades en un solo lugar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          © 2025 Clínica Médica. Todos los derechos reservados.
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-base-100 relative">
        {/* Decoración móvil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Logo móvil */}
        <div className="lg:hidden absolute top-8 left-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-lg">Clínica</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-md relative z-10">
          <div className="card bg-base-100 lg:shadow-2xl lg:border lg:border-base-300">
            <div className="card-body">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}