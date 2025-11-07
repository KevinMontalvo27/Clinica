import DashboardLayout from '../../../components/layouts/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Usuarios</h2>
              <p>Gestiona los usuarios del sistema</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Doctores</h2>
              <p>Administra los doctores</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Pacientes</h2>
              <p>Administra los pacientes</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}