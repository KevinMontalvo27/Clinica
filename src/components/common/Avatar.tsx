interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    placeholder?: string;
    online?: boolean;
    className?: string;
}

export default function Avatar({
    src,
    alt = 'avatar',
    size = 'md',
    placeholder = '?',
    online,
    className = '',
}: AvatarProps) {
    const sizes: Record<string, string> = {
        xs: 'w-8 h-8',
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
    };

    return (
        <div className={`avatar ${online ? 'online' : 'offline'} ${className}`}>
        <div className={`${sizes[size]} bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center`}>
            {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
            ) : (
            <span className="text-white font-bold">{placeholder}</span>
            )}
        </div>
        </div>
    );
}