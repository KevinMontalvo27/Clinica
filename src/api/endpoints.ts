export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Usuarios
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    BY_EMAIL: (email: string) => `/users/email/${email}`,
    SEARCH: '/users/search/query',
    BY_ROLE: (roleId: string) => `/users/role/${roleId}`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
  },

  // Doctores
  DOCTORS: {
    BASE: '/doctors',
    BY_ID: (id: string) => `/doctors/${id}`,
    BY_USER_ID: (userId: string) => `/doctors/user/${userId}`,
    AVAILABLE: '/doctors/available/list',
    BY_SPECIALTY: (specialtyId: string) => `/doctors/specialty/${specialtyId}`,
    SEARCH: '/doctors/search/query',
    POPULAR: '/doctors/popular/list',
    STATISTICS: (id: string) => `/doctors/${id}/statistics`,
  },

  // Pacientes
  PATIENTS: {
    BASE: '/patients',
    BY_ID: (id: string) => `/patients/${id}`,
    BY_USER_ID: (userId: string) => `/patients/user/${userId}`,
    ACTIVE: '/patients/active/list',
    BY_BLOOD_TYPE: (bloodType: string) => `/patients/blood-type/${bloodType}`,
    SEARCH: '/patients/search/query',
    STATISTICS: (id: string) => `/patients/${id}/statistics`,
  },

  // Citas
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: string) => `/appointments/${id}`,
    BY_DOCTOR: (doctorId: string) => `/appointments/doctor/${doctorId}`,
    BY_PATIENT: (patientId: string) => `/appointments/patient/${patientId}`,
    TODAY: '/appointments/today/list',
    UPCOMING: '/appointments/upcoming/list',
    CONFIRM: (id: string) => `/appointments/${id}/confirm`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
  },

  // Especialidades
  SPECIALTIES: {
    BASE: '/specialties',
    BY_ID: (id: string) => `/specialties/${id}`,
    BY_NAME: (name: string) => `/specialties/name/${name}`,
    AVAILABLE: '/specialties/available/list',
    POPULAR: '/specialties/popular/list',
  },

  MEDICAL_HISTORY: {
    BASE: '/medical-history',
    BY_ID: (id: string) => `/medical-history/${id}`,
    BY_PATIENT: (patientId: string) => `/medical-history/patient/${patientId}`,
    GENERATE: (patientId: string) => `/medical-history/patient/${patientId}/generate`,
    PDF: (historyId: string) => `/medical-history/${historyId}/pdf`,
    PREVIEW: (historyId: string) => `/medical-history/${historyId}/preview`,
    DELETE: (historyId: string) => `/medical-history/${historyId}`,
    STATS: (patientId: string) => `/medical-history/patient/${patientId}/stats`,
  },
} as const;