import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Map, Flame, Heart, CalendarCheck, LayoutDashboard, User } from 'lucide-react';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useApp();
    const isCreator = currentUser?.role === 'creator';

    const items = isCreator
        ? [
            { path: '/creator', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/trending', icon: Flame, label: 'Trending' },
            { path: '/home', icon: Map, label: 'Map' },
            { path: '/profile', icon: User, label: 'Profile' },
        ]
        : [
            { path: '/home', icon: Map, label: 'Map' },
            { path: '/trending', icon: Flame, label: 'Trending' },
            { path: '/following', icon: Heart, label: 'Following' },
            { path: '/my-rsvps', icon: CalendarCheck, label: 'RSVPs' },
            { path: '/profile', icon: User, label: 'Profile' },
        ];

    return (
        <nav className="bottom-nav">
            {items.map((item) => (
                <button key={item.path} className={'bottom-nav-item' + (location.pathname === item.path ? ' active' : '')}
                    onClick={() => navigate(item.path)}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
