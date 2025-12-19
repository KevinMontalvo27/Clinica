import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Button, Modal, Alert, Spinner, EmptyState, ConfirmDialog } from '../../../components/common';
import { ServiceCard } from '../components';
import ServiceForm from '../components/ServiceForm';
import { medicalServicesService } from '../../../api/services/medical-services.service';
import type { MedicalService } from '../../../api/services/medical-services.service';
import { useAuthStore } from '../../../store/authStore';
import { doctorsService } from '../../../api/services/doctors.service';

export default function MyServices() {
  const { user } = useAuthStore();
  const [services, setServices] = useState<MedicalService[]>([]);
  const [filteredServices, setFilteredServices] = useState<MedicalService[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<MedicalService | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  useEffect(() => {
    filterServices();
  }, [searchTerm, services]);

  const loadDoctorData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const doctor = await doctorsService.getByUserId(user.id);
      setDoctorId(doctor.id);
      await loadServices(doctor.id);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.response?.data?.message || 'Error al cargar los servicios');
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async (docId: string) => {
    const data = await medicalServicesService.getByDoctor(docId, false);
    setServices(data);
  };

  const filterServices = () => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleCreateService = async (values: any) => {
    if (!doctorId) return;

    try {
      await medicalServicesService.create({
        doctorId,
        ...values,
      });
      await loadServices(doctorId);
      setShowModal(false);
      setEditingService(null);
    } catch (err: any) {
      console.error('Error creando servicio:', err);
      throw err;
    }
  };

  const handleUpdateService = async (values: any) => {
    if (!editingService || !doctorId) return;

    try {
      await medicalServicesService.update(editingService.id, values);
      await loadServices(doctorId);
      setShowModal(false);
      setEditingService(null);
    } catch (err: any) {
      console.error('Error actualizando servicio:', err);
      throw err;
    }
  };

  const handleDeleteService = async () => {
    if (!deleteServiceId || !doctorId) return;

    try {
      await medicalServicesService.delete(deleteServiceId);
      await loadServices(doctorId);
      setDeleteServiceId(null);
    } catch (err: any) {
      console.error('Error eliminando servicio:', err);
      setError(err.response?.data?.message || 'Error al eliminar servicio');
    }
  };

  const handleToggleActive = async (serviceId: string, isActive: boolean) => {
    if (!doctorId) return;

    try {
      if (isActive) {
        await medicalServicesService.activate(serviceId);
      } else {
        await medicalServicesService.deactivate(serviceId);
      }
      await loadServices(doctorId);
    } catch (err: any) {
      console.error('Error cambiando estado:', err);
      setError(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleEdit = (service: MedicalService) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const activeServices = services.filter(s => s.isActive).length;
  const totalRevenue = services
    .filter(s => s.isActive)
    .reduce((sum, s) => sum + Number(s.price), 0);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando servicios..." />
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
            <h1 className="text-3xl font-bold">Mis Servicios</h1>
            <p className="text-base-content/60 mt-1">
              Gestiona los servicios médicos que ofreces
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Total de Servicios</p>
            <p className="text-3xl font-bold text-primary mt-1">{services.length}</p>
          </div>
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Servicios Activos</p>
            <p className="text-3xl font-bold text-success mt-1">{activeServices}</p>
          </div>
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Ingreso Potencial</p>
            <p className="text-3xl font-bold text-accent mt-1">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        {services.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        )}

        {/* Lista de servicios */}
        {services.length === 0 ? (
          <EmptyState
            icon="🩺"
            title="No tienes servicios"
            description="Comienza agregando los servicios médicos que ofreces"
            action={() => setShowModal(true)}
            actionLabel="Agregar Primer Servicio"
          />
        ) : filteredServices.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No se encontraron servicios"
            description="Intenta con otro término de búsqueda"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={(service.id)}
                name={service.name}
                description={service.description}
                price={service.price}
                duration={service.duration}
                isActive={service.isActive}
                onEdit={() => handleEdit(service)}
                onDelete={() => setDeleteServiceId(service.id)}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}

        {/* Modal: Crear/Editar Servicio */}
        <Modal
          isOpen={showModal}
          title={editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
          onClose={handleCloseModal}
          size="lg"
        >
          <ServiceForm
            initialValues={editingService ? {
              name: editingService.name,
              description: editingService.description,
              price: editingService.price,
              duration: editingService.duration,
              isActive: editingService.isActive,
            } : undefined}
            onSubmit={editingService ? handleUpdateService : handleCreateService}
            onCancel={handleCloseModal}
          />
        </Modal>

        {/* Confirm Dialog: Eliminar Servicio */}
        <ConfirmDialog
          isOpen={!!deleteServiceId}
          title="Eliminar Servicio"
          message="¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteService}
          onCancel={() => setDeleteServiceId(null)}
          isDangerous
        />
      </div>
    </DashboardLayout>
  );
}