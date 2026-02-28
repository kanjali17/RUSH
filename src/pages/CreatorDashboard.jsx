import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PopupCard from '../components/PopupCard';
import BottomNav from '../components/BottomNav';
import { Plus, Users, Heart, TrendingUp, LogOut } from 'lucide-react';

export default function CreatorDashboard() {
    const { popups, currentUser, creators, getPopupRsvps, logout } = useApp();
    const navigate = useNavigate();
    const creator = creators.find((c) => c.id === currentUser?.creator_id);
    const myPopups = useMemo(() => popups.filter((p) => p.creator_id === creator?.id), [popups, creator]);
    const upcoming = myPopups.filter((p) => p.status !== 'past');
    const past = myPopups.filter((p) => p.status === 'past');
    const totalRsvps = useMemo(() => myPopups.reduce((sum, p) => sum + getPopupRsvps(p.id).length, 0), [myPopups, getPopupRsvps]);

    return (
        <div className="page page-with-nav" style={{ gap: 'var(--sp-lg)' }}>
            <div className="flex items-center justify-between">
                <div>
                    <p style={{ color: 'var(--c-text-secondary)', fontSize: 'var(--fs-sm)' }}>Welcome back</p>
                    <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{creator?.name || 'Creator'} {creator?.avatar}</h1>
                </div>
                <button className="btn btn-icon btn-ghost" onClick={() => { logout(); navigate('/'); }}><LogOut size={20} /></button>
            </div>
            <div className="flex gap-md">
                <div className="card" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,179,71,0.05) 100%)' }}>
                    <Users size={22} color="var(--c-accent)" style={{ margin: '0 auto var(--sp-sm)' }} />
                    <p style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{totalRsvps}</p>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Total RSVPs</p>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(52,211,153,0.05) 100%)' }}>
                    <Heart size={22} color="var(--c-success)" style={{ margin: '0 auto var(--sp-sm)' }} />
                    <p style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{creator?.followers?.length || 0}</p>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Followers</p>
                </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/creator/new')} style={{ gap: 'var(--sp-sm)' }}>
                <Plus size={20} />Create New Popup
            </button>
            <div>
                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)' }}>
                    <TrendingUp size={18} style={{ display: 'inline', marginRight: 6 }} />Upcoming Popups
                </h2>
                {upcoming.length > 0 ? (
                    <div className="flex flex-col gap-md">
                        {upcoming.map((popup) => (
                            <div key={popup.id} className="flex flex-col gap-sm">
                                <PopupCard popup={popup} />
                                {popup.status === 'active' && (
                                    <button className="btn btn-secondary btn-sm btn-full" onClick={() => navigate('/creator/attendance/' + popup.id)}>Enter Attendance</button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)' }}>No upcoming popups. Create one!</p>}
            </div>
            {past.length > 0 && (
                <div>
                    <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)' }}>Past Popups</h2>
                    <div className="flex flex-col gap-md">{past.map((popup) => <PopupCard key={popup.id} popup={popup} />)}</div>
                </div>
            )}
            <BottomNav />
        </div>
    );
}
