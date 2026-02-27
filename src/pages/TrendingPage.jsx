import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Flame, TrendingUp } from 'lucide-react';

export default function TrendingPage() {
    const { popups, getTrendingScore, currentUser, getCreator, getPopupRsvps } = useApp();
    const navigate = useNavigate();

    const trendingPopups = useMemo(() => {
        const campusPopups = popups.filter(
            (p) => p.campus_id === currentUser?.campus_id
        );
        return [...campusPopups].sort(
            (a, b) => getTrendingScore(b) - getTrendingScore(a)
        );
    }, [popups, currentUser, getTrendingScore]);

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟', Asian: '🍜' };
        return map[type] || '🍽️';
    };

    return (
        <div className="page page-with-nav page-compact" style={{ gap: 'var(--sp-lg)' }}>
            <div className="top-bar">
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase" style={{ marginBottom: 'var(--sp-xs)' }}>
                        <Flame size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Trending
                    </p>
                    <h1 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>
                        Most Popular
                    </h1>
                    <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-xs)' }}>
                        Hot popups on campus right now
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-md">
                {trendingPopups.length > 0 ? (
                    trendingPopups.map((popup, i) => (
                        <div key={popup.id} style={{ position: 'relative' }}>
                            {/* Rank badge for top 3 */}
                            {i < 3 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -6,
                                        left: -6,
                                        zIndex: 1,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 'var(--r-full)',
                                        background: i === 0 ? 'var(--c-amber)' : 'var(--c-surface-active)',
                                        color: i === 0 ? '#000' : 'var(--c-text)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.65rem',
                                        fontWeight: 'var(--fw-bold)',
                                        fontFamily: 'var(--ff-display)',
                                        border: '2px solid var(--c-bg)',
                                    }}
                                >
                                    #{i + 1}
                                </div>
                            )}
                            <div
                                className="event-card"
                                onClick={() => navigate(`/popup/${popup.id}`)}
                            >
                                <div className="event-card-thumb">
                                    {foodEmoji(popup.food_type)}
                                </div>
                                <div className="event-card-info">
                                    <h4>{popup.title}</h4>
                                    <p>
                                        {getCreator(popup.creator_id)?.name} • {popup.location_name}
                                    </p>
                                </div>
                                <span className="badge badge-rsvp">
                                    {getPopupRsvps(popup.id).length} RSVPs
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center" style={{ padding: 'var(--sp-3xl) 0', color: 'var(--c-text-muted)' }}>
                        <Flame size={48} style={{ margin: '0 auto var(--sp-lg)', opacity: 0.2, color: 'var(--c-amber)' }} />
                        <p>No trending popups yet</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
