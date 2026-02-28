import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, Users, Clock } from 'lucide-react';

export default function PopupCard({ popup, showRsvpCount = true }) {
    const navigate = useNavigate();
    const { getCreator, getPopupRsvps, getAvgRating } = useApp();
    const creator = getCreator(popup.creator_id);
    const rsvpCount = getPopupRsvps(popup.id).length;
    const avgRating = getAvgRating(popup.id);

    const emoji = popup.food_type === 'Mexican' ? '🌮' : popup.food_type === 'BBQ' ? '🍖' : popup.food_type === 'Healthy' ? '🥗' : '🍽️';

    return (
        <button className="card" onClick={() => navigate('/popup/' + popup.id)}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 'var(--sp-base)', alignItems: 'center' }}>
            <div style={{
                width: 56, height: 56, background: 'var(--gradient-accent)', borderRadius: 'var(--r-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
            }}>{emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p className="truncate" style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-base)' }}>{popup.title}</p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', marginTop: 2 }}>{creator?.name}</p>
                <div className="flex items-center gap-md" style={{ marginTop: 'var(--sp-xs)' }}>
                    <div className="flex items-center gap-xs" style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>
                        <Clock size={12} />{popup.start_time} - {popup.end_time}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-xs" style={{ flexShrink: 0 }}>
                {avgRating > 0 && (
                    <div className="flex items-center gap-xs" style={{ color: 'var(--c-amber)', fontSize: 'var(--fs-sm)' }}>
                        <Star size={14} fill="currentColor" />{avgRating.toFixed(1)}
                    </div>
                )}
                {showRsvpCount && (
                    <div className="flex items-center gap-xs" style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-xs)' }}>
                        <Users size={12} />{rsvpCount}
                    </div>
                )}
            </div>
        </button>
    );
}
