import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Heart, ArrowLeft } from 'lucide-react';

export default function FollowingPage() {
    const { popups, currentUser, getCreator, getPopupRsvps } = useApp();
    const navigate = useNavigate();

    const followingPopups = useMemo(() => {
        if (!currentUser?.following?.length) return [];
        return popups.filter(
            (p) =>
                currentUser.following.includes(p.creator_id) &&
                p.campus_id === currentUser.campus_id
        );
    }, [popups, currentUser]);

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟', Asian: '🍜' };
        return map[type] || '🍽️';
    };

    return (
        <div className="page page-with-nav page-compact" style={{ gap: 'var(--sp-lg)' }}>
            <div className="top-bar">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </button>
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase" style={{ marginBottom: 'var(--sp-xs)' }}>
                        <Heart size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Saved
                    </p>
                    <h1 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>
                        Following
                    </h1>
                    <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-xs)' }}>
                        Popups from creators you follow
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-md">
                {followingPopups.length > 0 ? (
                    followingPopups.map((popup) => (
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
                                <p>{getCreator(popup.creator_id)?.name} • {popup.start_time}</p>
                            </div>
                            <span className="badge badge-rsvp">
                                {getPopupRsvps(popup.id).length}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center" style={{ padding: 'var(--sp-3xl) 0', color: 'var(--c-text-muted)' }}>
                        <Heart size={48} style={{ margin: '0 auto var(--sp-lg)', opacity: 0.15, color: 'var(--c-amber)' }} />
                        <p>Follow some creators to see their popups here</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
