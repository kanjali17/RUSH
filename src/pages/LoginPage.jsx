import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Utensils } from 'lucide-react';

export default function LoginPage() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('general');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email.endsWith('.edu')) {
            setError('Please use a valid .edu email address');
            return;
        }
        if (!password || password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }
        login(email, password, role);
        navigate('/campus');
    };

    return (
        <div className="page" style={{ justifyContent: 'center', gap: 'var(--sp-2xl)' }}>
            <div style={{
                position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div className="text-center" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <div style={{
                    width: 80, height: 80, background: 'var(--gradient-accent)', borderRadius: 'var(--r-xl)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--sp-lg)', boxShadow: 'var(--shadow-glow-strong)',
                }}>
                    <Utensils size={36} color="#fff" />
                </div>
                <h1 style={{
                    fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-black)',
                    background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                }}>RUSH</h1>
                <p style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-secondary)', marginTop: 'var(--sp-sm)' }}>
                    Find what's cooking on campus
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg" style={{ position: 'relative', zIndex: 1 }}>
                <div className="input-group">
                    <label className="input-label">Email</label>
                    <input type="email" className={`input ${error && !email.endsWith('.edu') ? 'input-error' : ''}`}
                        placeholder="yourname@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input type="password" className="input" placeholder="Enter password"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-group">
                    <label className="input-label">Role</label>
                    <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="general">General User</option>
                        <option value="creator">Creator</option>
                    </select>
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="btn btn-primary btn-full btn-lg">Continue</button>
            </form>
            <p className="text-center" style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 'auto' }}>
                Only .edu email addresses are accepted
            </p>
        </div>
    );
}
