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

    const handleSubmit = () => {
        const num = parseInt(count);
        if (isNaN(num) || num < 0) return;
        setAttendance(id, num);
        setSubmitted(true);
    };

    if (!popup) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <p>Popup not found</p>
            </div>
        );
    }

    return (
        <div className="page page-compact" style={{ gap: 'var(--sp-xl)' }}>
            <div className="top-bar">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </button>
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase">Post-Event</p>
                    <h1 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>Attendance</h1>
                </div>
            </div>

            {submitted ? (
                <div className="text-center flex flex-col gap-lg items-center" style={{ paddingTop: 'var(--sp-3xl)' }}>
                    <div style={{ animation: 'bounceIn 0.5s ease' }}>
                        <CheckCircle size={64} color="var(--c-success)" />
                    </div>
                    <h2 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>
                        Attendance Recorded!
                    </h2>
                    <p style={{ color: 'var(--c-text-secondary)' }}>
                        {count} people attended {popup.title}
                    </p>
                    <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)' }}>
                        This feeds into your trending score 🔥
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/creator')} style={{ marginTop: 'var(--sp-lg)' }}>
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-xl" style={{ paddingTop: 'var(--sp-xl)' }}>
                    <div className="text-center">
                        <div style={{
                            width: 80, height: 80,
                            background: 'var(--c-amber-glow)',
                            borderRadius: 'var(--r-full)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto var(--sp-lg)',
                        }}>
                            <Users size={36} color="var(--c-amber)" />
                        </div>
                        <h2 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>
                            How many people showed up?
                        </h2>
                        <p style={{ color: 'var(--c-text-secondary)', marginTop: 'var(--sp-sm)' }}>
                            {popup.title}
                        </p>
                    </div>

                    <div className="input-group" style={{ alignItems: 'center' }}>
                        <input
                            type="number"
                            className="input"
                            placeholder="0"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            min="0"
                            style={{
                                fontSize: 'var(--fs-3xl)',
                                textAlign: 'center',
                                fontWeight: 'var(--fw-bold)',
                                fontFamily: 'var(--ff-display)',
                                maxWidth: 200,
                            }}
                        />
                    </div>

                    <button
                        className="btn btn-primary btn-full btn-lg"
                        onClick={handleSubmit}
                        style={{ opacity: count ? 1 : 0.5 }}
                        disabled={!count}
                    >
                        Submit Attendance
                    </button>
                </div>
            )}
        </div>
    );
}
