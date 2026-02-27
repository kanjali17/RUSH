import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, ArrowRight, Zap } from 'lucide-react';

export default function CampusSelectPage() {
    const { campuses, selectCampus } = useApp();
    const navigate = useNavigate();

    const handleSelect = (campusId) => {
        selectCampus(campusId);
        navigate('/home');
    };

    return (
        <div className="page" style={{
            justifyContent: 'center',
            gap: 'var(--sp-2xl)',
            background: `
        radial-gradient(circle at 50% 30%, rgba(232,149,42,0.06) 0%, transparent 50%),
        var(--c-bg)
      `,
        }}>
            <div className="text-center">
                <div style={{
                    width: 56,
                    height: 56,
                    margin: '0 auto var(--sp-lg)',
                    background: 'var(--c-amber-glow)',
                    borderRadius: 'var(--r-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <MapPin size={26} color="var(--c-amber)" />
                </div>
                <p className="label-uppercase" style={{ marginBottom: 'var(--sp-sm)' }}>
                    Location
                </p>
                <h1 className="heading-display" style={{ fontSize: 'var(--fs-2xl)' }}>
                    Select Your Campus
                </h1>
                <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)', marginTop: 'var(--sp-sm)' }}>
                    We'll show pop-ups near you
                </p>
            </div>

            <div className="flex flex-col gap-md">
                {campuses.map((campus) => (
                    <div
                        key={campus.id}
                        className="event-card"
                        onClick={() => handleSelect(campus.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="event-card-thumb" style={{ background: 'var(--c-amber-glow)' }}>
                            <MapPin size={20} color="var(--c-amber)" />
                        </div>
                        <div className="event-card-info">
                            <h4>{campus.campus_name}</h4>
                            <p>{campus.city}, {campus.state}</p>
                        </div>
                        <ArrowRight size={16} color="var(--c-text-muted)" />
                    </div>
                ))}
            </div>
        </div>
    );
}
