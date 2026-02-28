import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RsvpModal from '../components/RsvpModal';
import ReportModal from '../components/ReportModal';
import { ArrowLeft, Heart, MapPin, Clock, Star, ExternalLink, Flag, MessageCircle, Users, ShoppingBag } from 'lucide-react';

export default function PopupDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { popups, getCreator, getPopupRsvps, getPopupReviews, getAvgRating, getUserRsvp, currentUser, followCreator } = useApp();
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
    const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(popup.address);

    const emoji = popup.food_type === 'Mexican' ? '🌮' : popup.food_type === 'BBQ' ? '🍖' : popup.food_type === 'Healthy' ? '🥗' : '🍽️';

    return (
        <div className="page" style={{ gap: 'var(--sp-lg)', paddingTop: 'var(--sp-base)' }}>
            <div className="flex items-center gap-md">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
            </div>
            <div style={{
                width: '100%', height: 180, background: 'var(--gradient-accent)', borderRadius: 'var(--r-xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem',
            }}>{emoji}</div>
            <div>
                <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{popup.title}</h1>
                <div className="flex items-center justify-between" style={{ marginTop: 'var(--sp-md)' }}>
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: 36, height: 36, background: 'var(--c-surface)', borderRadius: 'var(--r-full)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                        }}>{creator?.avatar}</div>
                        <div>
                            <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{creator?.name}</p>
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>{creator?.followers?.length || 0} followers</p>
                        </div>
                    </div>
                    <button className={'btn btn-sm ' + (isFollowing ? 'btn-primary' : 'btn-secondary')}
                        onClick={() => followCreator(popup.creator_id)}>
                        <Heart size={14} fill={isFollowing ? '#fff' : 'none'} />
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>
            </div>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                <span className="tag">{popup.food_type}</span>
                {popup.dietary_tags.map((tag) => (<span className="tag tag-success" key={tag}>{tag}</span>))}
                {popup.until_sold_out && (
                    <span className="tag" style={{ background: 'rgba(251,191,36,0.1)', color: 'var(--c-warning)', borderColor: 'rgba(251,191,36,0.2)' }}>Until Sold Out</span>
                )}
            </div>
            <div className="card" style={{ display: 'flex', gap: 'var(--sp-lg)' }}>
                <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                    <Clock size={18} color="var(--c-accent)" />
                    <div>
                        <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>{popup.start_time} - {popup.end_time}</p>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>{popup.start_date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-sm">
                    <Users size={18} color="var(--c-accent)" />
                    <span style={{ fontSize: 'var(--fs-sm)' }}>{rsvps.length} RSVPs</span>
                </div>
            </div>
            <div>
                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)' }}>
                    <ShoppingBag size={18} style={{ display: 'inline', marginRight: 6 }} />Menu
                </h3>
                <div className="card flex flex-col gap-md">
                    {popup.menu.map((item, i) => (
                        <div key={i} className="flex items-center justify-between"
                            style={{ paddingBottom: i < popup.menu.length - 1 ? 'var(--sp-md)' : 0, borderBottom: i < popup.menu.length - 1 ? '1px solid var(--c-border)' : 'none' }}>
                            <span style={{ fontSize: 'var(--fs-sm)' }}>{item}</span>
                            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--c-text-accent)' }}>{popup.prices[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)' }}>
                    <MapPin size={18} style={{ display: 'inline', marginRight: 6 }} />Location
                </h3>
                <div className="card">
                    <p style={{ fontWeight: 'var(--fw-medium)', marginBottom: 'var(--sp-xs)' }}>{popup.location_name}</p>
                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', marginBottom: 'var(--sp-md)' }}>{popup.address}</p>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        <ExternalLink size={14} />Open in Maps
                    </a>
                </div>
            </div>
            <div className="flex flex-col gap-md">
                <button className={'btn btn-full btn-lg ' + (userRsvp ? 'btn-secondary' : 'btn-primary')}
                    onClick={() => setShowRsvp(true)}>
                    {userRsvp ? (userRsvp.status === 'going' ? 'Going' : 'Interested') : 'RSVP'}
                </button>
                <button className="btn btn-secondary btn-full" onClick={() => alert('Messaging coming soon!')}>
                    <MessageCircle size={16} />Message Creator
                </button>
            </div>
            <div>
                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)' }}>
                    Reviews {avgRating > 0 && <span style={{ color: 'var(--c-amber)', fontSize: 'var(--fs-base)' }}>{'★ ' + avgRating.toFixed(1)}</span>}
                </h3>
                {reviews.length > 0 ? (
                    <div className="flex flex-col gap-md">
                        {reviews.map((review) => (
                            <div key={review.id} className="card">
                                <div className="stars" style={{ marginBottom: 'var(--sp-sm)' }}>
                                    {[1, 2, 3, 4, 5].map((s) => (<span key={s} className={'star' + (s <= review.rating ? ' filled' : '')}>&#9733;</span>))}
                                </div>
                                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                ) : <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)' }}>No reviews yet</p>}
                {reviews.length > 0 && (
                    <button className="btn btn-ghost btn-full" onClick={() => navigate('/reviews/' + popup.id)} style={{ marginTop: 'var(--sp-md)' }}>
                        See All Reviews
                    </button>
                )}
            </div>
            <button className="btn btn-ghost btn-full" onClick={() => setShowReport(true)} style={{ color: 'var(--c-text-muted)' }}>
                <Flag size={14} />Report this popup
            </button>
            <div style={{
                background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)',
                borderRadius: 'var(--r-md)', padding: 'var(--sp-base)', marginBottom: 'var(--sp-lg)',
            }}>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-warning)' }}>
                    This is an informal pop-up. RUSH does not verify food safety or licensing. Attend at your own discretion.
                </p>
            </div>
            {showRsvp && <RsvpModal popup={popup} onClose={() => setShowRsvp(false)} />}
            {showReport && <ReportModal popup={popup} onClose={() => setShowReport(false)} />}
        </div>
    );
}
