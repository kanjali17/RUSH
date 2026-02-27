import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RsvpModal from '../components/RsvpModal';
import ReportModal from '../components/ReportModal';
import {
    ArrowLeft,
    Heart,
    MapPin,
    Clock,
    Star,
    ExternalLink,
    Flag,
    MessageCircle,
    Users,
    ShoppingBag,
    BarChart3,
    Bookmark,
} from 'lucide-react';

export default function PopupDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        popups, getCreator, getPopupRsvps, getPopupReviews,
        getAvgRating, getUserRsvp, currentUser, followCreator, isMyPopup,
    } = useApp();

    const [showRsvp, setShowRsvp] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const popup = popups.find((p) => p.id === id);
    if (!popup) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <p>Popup not found</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    const creator = getCreator(popup.creator_id);
    const rsvps = getPopupRsvps(popup.id);
    const reviews = getPopupReviews(popup.id);
    const avgRating = getAvgRating(popup.id);
    const userRsvp = getUserRsvp(popup.id);
    const isFollowing = currentUser?.following?.includes(popup.creator_id);
    const isMine = isMyPopup(popup);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(popup.address)}`;

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟', Asian: '🍜' };
        return map[type] || '🍽️';
    };

    return (
        <div className="page" style={{ gap: 'var(--sp-lg)', paddingBottom: 'var(--sp-3xl)' }}>
            {/* Header */}
            <div className="flex items-center gap-md">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </button>
                <div style={{ flex: 1 }} />
                {isMine && (
                    <span className="badge badge-amber">Your Popup</span>
                )}
                {!isMine && (
                    <button className="btn btn-icon btn-ghost">
                        <Bookmark size={20} />
                    </button>
                )}
            </div>

            {/* Hero */}
            <div style={{
                width: '100%',
                height: 200,
                background: `linear-gradient(135deg, var(--c-surface) 0%, rgba(232,149,42,0.08) 100%)`,
                borderRadius: 'var(--r-2xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {foodEmoji(popup.food_type)}
                {/* Status badges */}
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 'var(--sp-sm)' }}>
                    {popup.status === 'active' && rsvps.length > 5 && (
                        <span className="badge badge-live">High Demand</span>
                    )}
                    {popup.until_sold_out && (
                        <span className="badge badge-amber">Limited</span>
                    )}
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 className="heading-display" style={{ fontSize: 'var(--fs-2xl)' }}>
                    {popup.title}
                </h1>
                <div className="flex items-center gap-md" style={{ marginTop: 'var(--sp-md)' }}>
                    <div className="flex items-center gap-md" style={{ flex: 1 }}>
                        <div className="avatar">{creator?.avatar}</div>
                        <div>
                            <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                                {creator?.name}
                            </p>
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>
                                {creator?.followers?.length || 0} followers
                            </p>
                        </div>
                    </div>
                    {!isMine && (
                        <button
                            className={`btn btn-sm ${isFollowing ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => followCreator(popup.creator_id)}
                        >
                            <Heart size={14} fill={isFollowing ? 'currentColor' : 'none'} />
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>

            {/* Tags */}
            <div className="flex gap-sm flex-wrap">
                <span className="badge badge-amber">{popup.food_type}</span>
                {popup.dietary_tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                ))}
            </div>

            {/* Time & RSVPs */}
            <div className="card" style={{ display: 'flex', gap: 'var(--sp-xl)' }}>
                <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                    <Clock size={18} color="var(--c-amber)" />
                    <div>
                        <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
                            {popup.start_time} – {popup.end_time}
                        </p>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>
                            {popup.start_date}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-sm">
                    <Users size={18} color="var(--c-amber)" />
                    <div>
                        <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
                            {rsvps.length}
                        </p>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>RSVPs</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div>
                <p className="section-title" style={{ marginBottom: 'var(--sp-md)' }}>
                    <ShoppingBag size={14} style={{ display: 'inline', marginRight: 6 }} />
                    Menu
                </p>
                <div className="card flex flex-col gap-md">
                    {popup.menu.map((item, i) => (
                        <div key={i} className="flex items-center justify-between" style={{
                            paddingBottom: i < popup.menu.length - 1 ? 'var(--sp-md)' : 0,
                            borderBottom: i < popup.menu.length - 1 ? '1px solid var(--c-border-light)' : 'none',
                        }}>
                            <span style={{ fontSize: 'var(--fs-sm)' }}>{item}</span>
                            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--c-amber)' }}>
                                {popup.prices[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location */}
            <div>
                <p className="section-title" style={{ marginBottom: 'var(--sp-md)' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />
                    Location
                </p>
                <div className="card">
                    <p style={{ fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-xs)' }}>
                        {popup.location_name}
                    </p>
                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', marginBottom: 'var(--sp-md)' }}>
                        {popup.address}
                    </p>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <ExternalLink size={14} /> Open in Maps
                    </a>
                </div>
            </div>

            {/* Actions */}
            {isMine ? (
                <div className="flex flex-col gap-md">
                    <p className="section-title" style={{ marginBottom: 'var(--sp-sm)' }}>Manage Popup</p>
                    <div className="flex gap-md">
                        <button className="btn btn-secondary" onClick={() => navigate(`/creator/attendance/${popup.id}`)} style={{ flex: 1 }}>
                            <BarChart3 size={16} /> Attendance
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate(`/reviews/${popup.id}`)} style={{ flex: 1 }}>
                            <Star size={16} /> Reviews
                        </button>
                    </div>
                    {/* RSVP Breakdown */}
                    <div className="card card-highlight">
                        <p className="stat-label" style={{ marginBottom: 'var(--sp-md)' }}>RSVP Breakdown</p>
                        <div className="flex gap-xl">
                            <div>
                                <p className="stat-number" style={{ color: 'var(--c-success)' }}>
                                    {rsvps.filter((r) => r.status === 'going').length}
                                </p>
                                <p className="stat-label">Going</p>
                            </div>
                            <div>
                                <p className="stat-number" style={{ color: 'var(--c-amber)' }}>
                                    {rsvps.filter((r) => r.status === 'interested').length}
                                </p>
                                <p className="stat-label">Interested</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-md">
                    <button
                        className={`btn btn-full btn-lg ${userRsvp ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => setShowRsvp(true)}
                    >
                        {userRsvp ? (userRsvp.status === 'going' ? '✅ Going' : '✨ Interested') : 'Reserve Now'}
                    </button>
                    <button className="btn btn-outline btn-full" onClick={() => alert('Messaging coming soon!')}>
                        <MessageCircle size={16} /> Message Creator
                    </button>
                </div>
            )}

            {/* Reviews */}
            <div>
                <div className="section-header">
                    <p className="section-title">
                        Reviews {avgRating > 0 && <span style={{ color: 'var(--c-amber)' }}>★ {avgRating.toFixed(1)}</span>}
                    </p>
                    {reviews.length > 0 && (
                        <button className="section-link" onClick={() => navigate(`/reviews/${popup.id}`)}>
                            See All
                        </button>
                    )}
                </div>
                {reviews.length > 0 ? (
                    <div className="flex flex-col gap-md">
                        {reviews.slice(0, 2).map((review) => (
                            <div key={review.id} className="card">
                                <div className="stars" style={{ marginBottom: 'var(--sp-sm)' }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className={`star ${s <= review.rating ? 'filled' : ''}`}>★</span>
                                    ))}
                                </div>
                                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)' }}>No reviews yet</p>
                )}
            </div>

            {/* Report / Disclaimer */}
            {!isMine && (
                <>
                    <button className="btn btn-ghost btn-full" onClick={() => setShowReport(true)} style={{ color: 'var(--c-text-muted)' }}>
                        <Flag size={14} /> Report this popup
                    </button>
                    <div style={{
                        background: 'rgba(255,214,10,0.05)',
                        border: '1px solid rgba(255,214,10,0.1)',
                        borderRadius: 'var(--r-lg)',
                        padding: 'var(--sp-base)',
                    }}>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>
                            ⚠️ Informal pop-up. PopUpFinder does not verify food safety or licensing. Attend at your own discretion.
                        </p>
                    </div>
                </>
            )}

            {showRsvp && <RsvpModal popup={popup} onClose={() => setShowRsvp(false)} />}
            {showReport && <ReportModal popup={popup} onClose={() => setShowReport(false)} />}
        </div>
    );
}
