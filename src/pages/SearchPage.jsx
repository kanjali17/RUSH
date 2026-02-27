import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Search, X, ArrowLeft, Zap } from 'lucide-react';

const SUGGESTIONS = ['Mexican', 'Desserts', 'Late Night', 'Healthy', 'Near Me', 'BBQ', 'Vegan'];

export default function SearchPage() {
    const { popups, currentUser, getCreator, getPopupRsvps } = useApp();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return popups.filter(
            (p) =>
                p.campus_id === currentUser?.campus_id &&
                (p.title.toLowerCase().includes(q) ||
                    p.food_type.toLowerCase().includes(q) ||
                    p.location_name.toLowerCase().includes(q) ||
                    (p.zip && p.zip.includes(q)) ||
                    p.dietary_tags.some((t) => t.toLowerCase().includes(q)))
        );
    }, [query, popups, currentUser]);

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟', Asian: '🍜' };
        return map[type] || '🍽️';
    };

    return (
        <div className="page page-with-nav page-compact" style={{ gap: 'var(--sp-lg)' }}>
            {/* Header */}
            <div className="top-bar">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </button>
                <p className="label-uppercase" style={{ flex: 1 }}>Search</p>
            </div>

            {/* Search bar */}
            <div className="search-bar">
                <Search size={18} color="var(--c-amber)" />
                <input
                    type="text"
                    placeholder="Search popups, food types, locations..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                {query && (
                    <button onClick={() => setQuery('')} style={{ color: 'var(--c-text-muted)' }}>
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Suggestion chips */}
            {!query && (
                <div>
                    <p className="section-title" style={{ marginBottom: 'var(--sp-md)' }}>
                        <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Quick Search
                    </p>
                    <div className="flex gap-sm flex-wrap">
                        {SUGGESTIONS.map((s) => (
                            <button key={s} className="chip chip-default" onClick={() => setQuery(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {query && (
                <div>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginBottom: 'var(--sp-md)' }}>
                        {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-col gap-md">
                        {results.length > 0 ? (
                            results.map((popup) => (
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
                                        <p>{popup.start_time} • {popup.location_name}</p>
                                    </div>
                                    <span className="badge badge-rsvp">
                                        {getPopupRsvps(popup.id).length}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center" style={{ padding: 'var(--sp-3xl)', color: 'var(--c-text-muted)' }}>
                                No popups match your search
                            </div>
                        )}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
