import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, Clock } from 'lucide-react';

export default function PopupCard({ popup, showRsvpCount = true }) {
    const navigate = useNavigate();
    const { getCreator, getPopupRsvps, getAvgRating } = useApp();

    const creator = getCreator(popup.creator_id);
    const rsvpCount = getPopupRsvps(popup.id).length;
    const avgRating = getAvgRating(popup.id);

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟', Asian: '🍜', Italian: '🍝', Meals: '🍽️' };
        return map[type] || '🍽️';
    };

    return (
        <div
            className="event-card"
            onClick={() => navigate(`/popup/${popup.id}`)}
        >
            <div className="event-card-thumb">
                {foodEmoji(popup.food_type)}
            </div>
            <div className="event-card-info">
                <h4>{popup.title}</h4>
                <p style={{ marginBottom: 2 }}>{creator?.name}</p>
                <div className="flex items-center gap-xs" style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>
                    <Clock size={10} />
                    {popup.start_time} – {popup.end_time}
                </div>
            </div>
            <div className="flex flex-col items-center gap-xs" style={{ flexShrink: 0 }}>
                {avgRating > 0 && (
                    <div className="flex items-center gap-xs" style={{ color: 'var(--c-amber)', fontSize: 'var(--fs-xs)' }}>
                        <Star size={12} fill="currentColor" />
                        {avgRating.toFixed(1)}
                    </div>
                )}
                {showRsvpCount && (
                    <span className="badge badge-rsvp" style={{ fontSize: '0.6rem' }}>
                        {rsvpCount}
                    </span>
                )}
            </div>
        </div>
    );
}
