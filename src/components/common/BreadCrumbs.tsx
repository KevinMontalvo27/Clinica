interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({
    items = [],
    className = '',
}: BreadcrumbsProps) {
    return (
        <div className={`breadcrumbs text-sm ${className}`}>
        <ul>
            {items.map((item, index) => (
            <li key={index}>
                {item.href ? (
                <a href={item.href} className="link link-hover">
                    {item.label}
                </a>
                ) : (
                <span>{item.label}</span>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
}