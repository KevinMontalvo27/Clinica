
interface DoctorStatsProps {
    todayAppointments: number;
    totalPatients: number;
    monthlyEarnings: number;
    cancelledAppointments: number;
    className?: string;
}

interface StatItemProps {
    icon: string;
    label: string;
    value: string | number;
    color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
    subtitle?: string;
}

function StatItem({ icon, label, value, color, subtitle }: StatItemProps) {
    const colorClasses: Record<string, string> = {
        primary: 'bg-primary/10 text-primary border-primary/30',
        secondary: 'bg-secondary/10 text-secondary border-secondary/30',
        accent: 'bg-accent/10 text-accent border-accent/30',
        success: 'bg-success/10 text-success border-success/30',
        warning: 'bg-warning/10 text-warning border-warning/30',
        error: 'bg-error/10 text-error border-error/30',
    };

    return (
        <div className={`rounded-lg border p-4 ${colorClasses[color]} transition-all hover:shadow-md`}>
        <div className="flex items-start justify-between">
            <div>
            <p className="text-sm font-medium text-base-content/70">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>}
            </div>
            <span className="text-3xl">{icon}</span>
        </div>
        </div>
    );
    }

    export default function DoctorStats({
    todayAppointments,
    totalPatients,
    monthlyEarnings,
    cancelledAppointments,
    className = '',
    }: DoctorStatsProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        <StatItem
            icon="📅"
            label="Citas Hoy"
            value={todayAppointments}
            color="primary"
            subtitle="programadas para hoy"
        />
        <StatItem
            icon="👥"
            label="Pacientes Totales"
            value={totalPatients}
            color="secondary"
            subtitle="en tu lista de pacientes"
        />
        <StatItem
            icon="💰"
            label="Ganancias del Mes"
            value={`$${monthlyEarnings.toLocaleString()}`}
            color="success"
            subtitle="ingresos acumulados"
        />
        <StatItem
            icon="❌"
            label="Citas Canceladas"
            value={cancelledAppointments}
            color="error"
            subtitle="este mes"
        />
        </div>
    );
}