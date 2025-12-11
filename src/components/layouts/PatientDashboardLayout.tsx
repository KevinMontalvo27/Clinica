import PatientNavbar from './PatientNavBar';

interface PatientDashboardLayoutProps {
  children: React.ReactNode;
}

export default function PatientDashboardLayout({ children }: PatientDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <PatientNavbar />

      {/* Content */}
      <main className="container mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Footer (opcional) */}
      <footer className="footer footer-center p-4 bg-base-100 text-base-content border-t border-base-300 mt-8">
        <aside>
          <p className="text-sm">
            © {new Date().getFullYear()} Clínica Médica. Todos los derechos reservados.
          </p>
        </aside>
      </footer>
    </div>
  );
}