import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Flame, Heart, User } from 'lucide-react';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { path: '/home', icon: Compass, label: 'Discovery' },
        { path: '/trending', icon: Flame, label: 'Trending' },
        { path: '/following', icon: Heart, label: 'Saved' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="bottom-nav">
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.path}
                        className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon size={20} fill={isActive ? 'currentColor' : 'none'} />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
