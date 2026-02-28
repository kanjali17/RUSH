import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, ChevronRight } from 'lucide-react';

export default function CampusSelectPage() {
    const { campuses, selectCampus, currentUser } = useApp();
    const navigate = useNavigate();

    const handleSelect = (campusId) => {
        selectCampus(campusId);
        navigate(currentUser?.role === 'creator' ? '/creator' : '/home');
    };

    return (
        <div className="page" style={{ gap: 'var(--sp-2xl)' }}>
            <div style={{ marginTop: 'var(--sp-3xl)' }}>
                <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>Select Your Campus</h1>
                <p style={{ color: 'var(--c-text-secondary)', marginTop: 'var(--sp-sm)' }}>Choose where you want to discover popups</p>
            </div>
            <div className="flex flex-col gap-md">
                {campuses.map((campus) => (
                    <button key={campus.id} className="card" onClick={() => handleSelect(campus.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-base)', textAlign: 'left', cursor: 'pointer' }}>
                        <div style={{
                            width: 48, height: 48, background: 'var(--gradient-accent)', borderRadius: 'var(--r-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <MapPin size={22} color="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-md)' }}>{campus.campus_name}</p>
                            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>{campus.city}, {campus.state}</p>
                        </div>
                        <ChevronRight size={20} color="var(--c-text-muted)" />
                    </button>
                ))}
            </div>
        </div>
    );
}
