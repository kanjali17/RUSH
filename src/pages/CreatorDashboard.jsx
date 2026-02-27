import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Plus, Bell, TrendingUp } from 'lucide-react';

export default function CreatorDashboard() {
    const { popups, currentUser, getPopupRsvps, getMyCreator } = useApp();
    const navigate = useNavigate();
    const creator = getMyCreator();

    if (!creator) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-lg)' }}>
                <p style={{ color: 'var(--c-text-secondary)' }}>No creator profile yet</p>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                    Set Up Creator Profile
                </button>
            </div>
        );
    }

    const myPopups = useMemo(() => popups.filter((p) => p.creator_id === creator.id), [popups, creator]);
    const upcoming = myPopups.filter((p) => p.status !== 'past');
    const past = myPopups.filter((p) => p.status === 'past');

    const totalRsvps = useMemo(() => myPopups.reduce((sum, p) => sum + getPopupRsvps(p.id).length, 0), [myPopups, getPopupRsvps]);
    const totalAttendance = useMemo(() => myPopups.reduce((sum, p) => sum + (p.attendance || 0), 0), [myPopups]);
    const rsvpRate = totalRsvps > 0 ? ((totalAttendance / (totalRsvps || 1)) * 100).toFixed(1) : '0.0';

    // Simulated revenue
    const revenue = (totalAttendance * 8.5).toFixed(2);

    // Simple chart data
    const chartPoints = [20, 35, 28, 45, 38, 55, 72];
    const chartMax = Math.max(...chartPoints);
    const svgPath = chartPoints.map((p, i) => {
        const x = (i / (chartPoints.length - 1)) * 100;
        const y = 100 - (p / chartMax) * 80;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟' };
        return map[type] || '🍽️';
    };

    return (
        <div className="page page-with-nav page-compact" style={{ gap: 'var(--sp-lg)' }}>
            {/* Header */}
            <div className="top-bar">
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase">Creator Hub</p>
                    <h1 className="heading-display" style={{ fontSize: 'var(--fs-2xl)', marginTop: 'var(--sp-xs)' }}>
                        Analytics
                    </h1>
                </div>
                <button
                    className="btn btn-icon"
                    style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border-light)' }}
                >
                    <Bell size={18} color="var(--c-text-secondary)" />
                </button>
                <div
                    className="avatar"
                    onClick={() => navigate('/profile')}
                    style={{ cursor: 'pointer' }}
                >
                    {creator.avatar}
                </div>
            </div>

            {/* Revenue Card with Chart */}
            <div className="card" style={{ padding: 'var(--sp-xl)' }}>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', fontFamily: 'var(--ff-display)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', marginBottom: 'var(--sp-xs)' }}>
                    Total Revenue
                </p>
                <div className="flex items-center gap-md" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <h2 className="heading-display" style={{ fontSize: 'var(--fs-3xl)' }}>
                        ${revenue}
                    </h2>
                    <span className="badge badge-success" style={{ fontSize: 'var(--fs-xs)' }}>
                        +24.8%
                    </span>
                </div>

                {/* SVG Line Chart */}
                <div className="chart-line" style={{ height: 100, marginBottom: 'var(--sp-md)' }}>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--c-amber)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--c-amber)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d={`${svgPath} L 100 100 L 0 100 Z`} fill="url(#lineGrad)" />
                        <path d={svgPath} fill="none" stroke="var(--c-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="chart-labels">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>

                {/* Stats row */}
                <div className="stats-grid" style={{ marginTop: 'var(--sp-xl)' }}>
                    <div>
                        <p className="stat-label">RSVP Rate</p>
                        <p className="stat-number">{rsvpRate}%</p>
                    </div>
                    <div>
                        <p className="stat-label">Followers</p>
                        <p className="stat-number">+{creator.followers.length.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Live & Upcoming */}
            <div>
                <div className="section-header">
                    <p className="section-title" style={{
                        color: 'var(--c-amber)',
                        borderBottom: '2px solid var(--c-amber)',
                        paddingBottom: 'var(--sp-xs)',
                    }}>
                        Live & Upcoming
                    </p>
                    <button className="section-link">View Schedule</button>
                </div>

                <div className="flex flex-col gap-md">
                    {upcoming.length > 0 ? upcoming.map((popup) => (
                        <div
                            key={popup.id}
                            className="event-card"
                            onClick={() => navigate(`/popup/${popup.id}`)}
                        >
                            <div className="event-card-thumb">
                                {foodEmoji(popup.food_type)}
                            </div>
                            <div className="event-card-info">
                                <h4>{popup.title}</h4>
                                <p>{popup.start_date} {popup.start_time} • {popup.location_name}</p>
                            </div>
                            <span className="badge badge-rsvp">
                                {getPopupRsvps(popup.id).length} RSVPs
                            </span>
                        </div>
                    )) : (
                        <div className="card text-center" style={{ padding: 'var(--sp-2xl)', color: 'var(--c-text-muted)' }}>
                            <p>No upcoming popups</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Past Popups */}
            {past.length > 0 && (
                <div>
                    <div className="section-header">
                        <p className="section-title">Past Popups</p>
                    </div>
                    <div className="flex flex-col gap-md">
                        {past.map((popup) => (
                            <div
                                key={popup.id}
                                className="event-card"
                                onClick={() => navigate(`/popup/${popup.id}`)}
                                style={{ opacity: 0.7 }}
                            >
                                <div className="event-card-thumb">
                                    {foodEmoji(popup.food_type)}
                                </div>
                                <div className="event-card-info">
                                    <h4>{popup.title}</h4>
                                    <p>{popup.attendance || 0} attended • {popup.start_date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FAB */}
            <button className="fab" onClick={() => navigate('/creator/new')}>
                <Plus size={24} />
            </button>

            <BottomNav />
        </div>
    );
}
