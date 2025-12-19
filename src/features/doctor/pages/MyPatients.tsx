import { useState, useEffect } from 'react';
import { UserPlus, FileText, Activity } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Button, Alert, Modal, ConfirmDialog, Spinner } from '../../../components/common';
import { PatientList } from '../components';
import { patientsService } from '../../../api/services/patients.service';
import type { Patient } from '../../../api/services/patients.service';

export default function MyPatients() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await patientsService.getActive();
      setPatients(data);
    } catch (err: any) {
      console.error('Error cargando pacientes:', err);
      setError(err.response?.data?.message || 'Error al cargar los pacientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientSelect = (id: string) => {
    const patient = patients.find(p => p.id === String(id));
    if (patient) {
      setSelectedPatient(patient);
      setShowDetailsModal(true);
    }
  };

  const handleViewDetails = (id: string) => {
    handlePatientSelect(id);
  };

  const handleEdit = (id: string) => {
    console.log('Editar paciente:', id);
    // TODO: Implementar edición
  };

  const handleDelete = (id: string) => {
    setDeletePatientId(String(id));
  };

  const confirmDelete = async () => {
    if (!deletePatientId) return;

    try {
      await patientsService.delete(deletePatientId);
      await loadPatients();
      setDeletePatientId(null);
      setSuccess('Paciente eliminado correctamente');
    } catch (err: any) {
      console.error('Error eliminando paciente:', err);
      setError(err.response?.data?.message || 'Error al eliminar paciente');
      setDeletePatientId(null);
    }
  };

  // Transformar datos para PatientList
  const transformedPatients = patients.map(p => ({
    id: p.id,
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    email: p.user.email,
    phone: p.user.phone || '',
    avatar: undefined,
    lastVisit: p.appointments?.[0]?.appointmentDate,
    totalVisits: p.appointments?.length || 0,
    allergies: [], // TODO: Implementar cuando tengas medical records
  }));

  // Estadísticas
  const stats = {
    total: patients.length,
    active: patients.filter(p => p.user.isActive).length,
    newThisMonth: patients.filter(p => {
      const created = new Date(p.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && 
             created.getFullYear() === now.getFullYear();
    }).length,
    averageVisits: patients.length > 0
      ? Math.round(
          patients.reduce((sum, p) => sum + (p.appointments?.length || 0), 0) / patients.length
        )
      : 0,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando pacientes..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mis Pacientes</h1>
            <p className="text-base-content/60 mt-1">
              Administra tu lista de pacientes
            </p>
          </div>
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" closeable onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Total Pacientes</p>
            <p className="text-3xl font-bold text-primary mt-1">{stats.total}</p>
          </div>
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Activos</p>
            <p className="text-3xl font-bold text-success mt-1">{stats.active}</p>
          </div>
          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Nuevos Este Mes</p>
            <p className="text-3xl font-bold text-info mt-1">{stats.newThisMonth}</p>
          </div>
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Promedio Visitas</p>
            <p className="text-3xl font-bold text-accent mt-1">{stats.averageVisits}</p>
          </div>
        </div>

        {/* Lista de Pacientes */}
        <PatientList
          patients={transformedPatients}
          onPatientSelect={handlePatientSelect}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal: Detalles del Paciente */}
        <Modal
          isOpen={showDetailsModal}
          title="Detalles del Paciente"
          onClose={() => setShowDetailsModal(false)}
          size="lg"
        >
          {selectedPatient && (
            <div className="space-y-6">
              {/* Información personal */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-base-200 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-base-content/60">Nombre Completo</p>
                    <p className="font-medium">{selectedPatient.user.firstName} {selectedPatient.user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Email</p>
                    <p className="font-medium">{selectedPatient.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Teléfono</p>
                    <p className="font-medium">{selectedPatient.user.phone || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Tipo de Sangre</p>
                    <p className="font-medium">{selectedPatient.bloodType || 'No registrado'}</p>
                  </div>
                </div>
              </div>

              {/* Contacto de Emergencia */}
              {selectedPatient.emergencyContactName && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">👤 Contacto de Emergencia</h3>
                  <div className="bg-base-200 rounded-lg p-4">
                    <p className="text-sm text-base-content/60">Nombre</p>
                    <p className="font-medium mb-2">{selectedPatient.emergencyContactName}</p>
                    <p className="text-sm text-base-content/60">Teléfono</p>
                    <p className="font-medium">{selectedPatient.emergencyContactPhone}</p>
                  </div>
                </div>
              )}

              {/* Seguro Médico */}
              {selectedPatient.insuranceProvider && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">🏥 Seguro Médico</h3>
                  <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                    <p className="text-sm text-base-content/60">Proveedor</p>
                    <p className="font-medium mb-2">{selectedPatient.insuranceProvider}</p>
                    <p className="text-sm text-base-content/60">Número de Póliza</p>
                    <p className="font-medium">{selectedPatient.insuranceNumber}</p>
                  </div>
                </div>
              )}

              {/* Estadísticas */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Estadísticas
                </h3>
                <div className="grid grid-cols-3 gap-4 bg-base-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{selectedPatient.appointments?.length || 0}</p>
                    <p className="text-xs text-base-content/60">Total Citas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {selectedPatient.appointments?.filter(a => a.status === 'COMPLETED').length || 0}
                    </p>
                    <p className="text-xs text-base-content/60">Completadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{selectedPatient.medicalRecords?.length || 0}</p>
                    <p className="text-xs text-base-content/60">Registros</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit((selectedPatient.id));
                  }}
                >
                  Editar Información
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Confirm Dialog: Eliminar Paciente */}
        <ConfirmDialog
          isOpen={!!deletePatientId}
          title="Eliminar Paciente"
          message="¿Estás seguro de que deseas eliminar este paciente? Se perderá todo el historial médico. Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={() => setDeletePatientId(null)}
          isDangerous
        />
      </div>
    </DashboardLayout>
  );
}