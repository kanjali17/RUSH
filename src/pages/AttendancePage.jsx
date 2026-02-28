import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';

export default function AttendancePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { popups, setAttendance } = useApp();
    const [count, setCount] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const popup = popups.find((p) => p.id === id);
    if (!popup) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <p>Popup not found</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    const handleSubmit = () => {
        const num = parseInt(count, 10);
        if (isNaN(num) || num < 0) return;
        setAttendance(popup.id, num);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-xl)' }}>
                <div style={{ animation: 'bounceIn 0.6s ease' }}>
                    <CheckCircle size={64} color="var(--c-success)" />
                </div>
                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>Attendance Recorded!</h2>
                <p style={{ color: 'var(--c-text-secondary)', textAlign: 'center' }}>
                    {count} people attended <strong>{popup.title}</strong>
                </p>
                <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/creator')}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="page" style={{ gap: 'var(--sp-xl)' }}>
            <div className="flex items-center gap-md">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
                <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>Enter Attendance</h1>
            </div>
            <div className="card" style={{
                textAlign: 'center', padding: 'var(--sp-2xl)',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,179,71,0.05) 100%)',
            }}>
                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-sm)' }}>{popup.title}</h2>
                <p style={{ color: 'var(--c-text-secondary)', fontSize: 'var(--fs-sm)' }}>{popup.location_name}</p>
            </div>
            <div className="input-group" style={{ alignItems: 'center' }}>
                <label className="input-label" style={{ textAlign: 'center' }}>How many people attended?</label>
                <div className="flex items-center gap-md" style={{ justifyContent: 'center' }}>
                    <Users size={24} color="var(--c-accent)" />
                    <input type="number" className="input" placeholder="0" value={count}
                        onChange={(e) => setCount(e.target.value)} min="0"
                        style={{ width: 120, textAlign: 'center', fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }} />
                </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit}
                disabled={!count || parseInt(count, 10) < 0}>
                Submit Attendance
            </button>
        </div>
    );
}
