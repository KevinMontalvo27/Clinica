// src/features/doctor/pages/DoctorDashboard.tsx
import DashboardLayout from '../../../components/layouts/DashboardLayout';

export default function DoctorDashboard() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4">Panel del Doctor</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Mis Pacientes</h2>
              <p>Lista de pacientes asignados</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Citas del Día</h2>
              <p>Agenda de hoy</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}