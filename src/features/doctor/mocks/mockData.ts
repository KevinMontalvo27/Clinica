export const mockAppointments = [
    {
        id: 1,
        patientName: 'Juan Pérez López',
        patientAvatar: undefined,
        date: '2024-11-20',
        time: '09:00',
        duration: 30,
        status: 'SCHEDULED' as const,
        reason: 'Dolor de cabeza persistente',
    },
    {
        id: 2,
        patientName: 'María García Rodríguez',
        patientAvatar: undefined,
        date: '2024-11-20',
        time: '09:30',
        duration: 30,
        status: 'SCHEDULED' as const,
        reason: 'Control de presión arterial',
    },
    {
        id: 3,
        patientName: 'Carlos López Martínez',
        patientAvatar: undefined,
        date: '2024-11-20',
        time: '10:00',
        duration: 45,
        status: 'SCHEDULED' as const,
        reason: 'Chequeo general',
    },
    {
        id: 4,
        patientName: 'Ana Sánchez Ruiz',
        patientAvatar: undefined,
        date: '2024-11-19',
        time: '14:00',
        duration: 30,
        status: 'COMPLETED' as const,
        reason: 'Seguimiento post-operatorio',
    },
    {
        id: 5,
        patientName: 'Miguel Torres Gómez',
        patientAvatar: undefined,
        date: '2024-11-18',
        time: '11:00',
        duration: 30,
        status: 'CANCELLED' as const,
        reason: 'Cancelada por el paciente',
    },
];

    // ==================== PATIENTS ====================
export const mockPatients = [
    {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        phone: '+52 668 123 4567',
        avatar: undefined,
        lastVisit: '2024-11-15',
        totalVisits: 12,
        allergies: ['Penicilina', 'Mariscos'],
    },
    {
        id: 2,
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@email.com',
        phone: '+52 668 234 5678',
        avatar: undefined,
        lastVisit: '2024-11-20',
        totalVisits: 8,
        allergies: ['Ibuprofeno'],
    },
    {
        id: 3,
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@email.com',
        phone: '+52 668 345 6789',
        avatar: undefined,
        lastVisit: '2024-11-10',
        totalVisits: 5,
        allergies: [],
    },
    {
        id: 4,
        firstName: 'Ana',
        lastName: 'Sánchez',
        email: 'ana.sanchez@email.com',
        phone: '+52 668 456 7890',
        avatar: undefined,
        lastVisit: '2024-11-19',
        totalVisits: 15,
        allergies: ['Aspirina'],
    },
    {
        id: 5,
        firstName: 'Miguel',
        lastName: 'Torres',
        email: 'miguel.torres@email.com',
        phone: '+52 668 567 8901',
        avatar: undefined,
        lastVisit: '2024-11-08',
        totalVisits: 3,
        allergies: [],
    },
];

    // ==================== SERVICES ====================
export const mockServices = [
    {
        id: 1,
        name: 'Consulta General',
        description: 'Consulta médica general para diagnóstico y tratamiento',
        price: 500,
        duration: 30,
        isActive: true,
        totalAppointments: 145,
    },
    {
        id: 2,
        name: 'Consulta de Seguimiento',
        description: 'Seguimiento de pacientes después de tratamiento',
        price: 300,
        duration: 20,
        isActive: true,
        totalAppointments: 67,
    },
    {
        id: 3,
        name: 'Control de Signos Vitales',
        description: 'Monitoreo de presión, frecuencia cardíaca y temperatura',
        price: 150,
        duration: 15,
        isActive: true,
        totalAppointments: 89,
    },
    {
        id: 4,
        name: 'Inyecciones',
        description: 'Aplicación de inyecciones prescritas',
        price: 200,
        duration: 10,
        isActive: true,
        totalAppointments: 34,
    },
    {
        id: 5,
        name: 'Consulta Especializada',
        description: 'Consulta especializada con revisión exhaustiva',
        price: 800,
        duration: 45,
        isActive: false,
        totalAppointments: 12,
    },
];

    // ==================== DOCTOR STATS ====================
export const mockDoctorStats = {
    todayAppointments: 6,
    totalPatients: 42,
    monthlyEarnings: 15750,
    cancelledAppointments: 3,
};

// ==================== TYPES ====================
export type Appointment = typeof mockAppointments[0];
export type Patient = typeof mockPatients[0];
export type Service = typeof mockServices[0];
export type DoctorStats = typeof mockDoctorStats;