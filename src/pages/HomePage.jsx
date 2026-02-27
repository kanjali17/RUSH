import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, Clock, Plus, User, Zap } from 'lucide-react';
import FilterDrawer from '../components/FilterDrawer';
import BottomNav from '../components/BottomNav';
import 'leaflet/dist/leaflet.css';

function createPinIcon(label) {
    return L.divIcon({
        className: '',
        html: `<div class="custom-pin">${label}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 30],
        popupAnchor: [0, -35],
    });
}

const QUICK_FILTERS = [
    { id: 'fast', label: 'Fast Track', icon: '⚡' },
    { id: 'late', label: 'Late Night', icon: null },
    { id: 'hidden', label: 'Hidden Gems', icon: null },
    { id: 'healthy', label: 'Healthy', icon: null },
    { id: 'desserts', label: 'Desserts', icon: null },
];

export default function HomePage() {
    const { popups, currentUser, getCreator, getPopupRsvps, campuses } = useApp();
    const navigate = useNavigate();
    const [showFilter, setShowFilter] = useState(false);
    const [activeChip, setActiveChip] = useState('fast');
    const [filters, setFilters] = useState({
        date: '',
        food_type: '',
        dietary: '',
        zip: '',
    });

    const campus = campuses.find((c) => c.id === currentUser?.campus_id);

    const todayPopups = useMemo(() => {
        let filtered = popups.filter((p) => p.campus_id === currentUser?.campus_id);

        if (filters.date) {
            filtered = filtered.filter((p) => p.start_date === filters.date);
        } else {
            filtered = filtered.filter((p) => p.status !== 'past');
        }
        if (filters.food_type) {
            filtered = filtered.filter((p) => p.food_type.toLowerCase() === filters.food_type.toLowerCase());
        }
        if (filters.dietary) {
            filtered = filtered.filter((p) => p.dietary_tags.some((t) => t.toLowerCase().includes(filters.dietary.toLowerCase())));
        }
        if (filters.zip) {
            filtered = filtered.filter((p) => p.zip === filters.zip);
        }
        return filtered;
    }, [popups, currentUser, filters]);

    const featuredPopup = todayPopups[0];

    const foodEmoji = (type) => {
        const map = { Mexican: '🌮', BBQ: '🍖', Healthy: '🥗', Desserts: '🍰', Drinks: '🧃', Snacks: '🥟', Asian: '🍜', Italian: '🍝', Meals: '🍽️' };
        return map[type] || '🍽️';
    };

    return (
        <div className="page page-with-nav page-compact" style={{ gap: 0 }}>
            {/* Top Bar — Search + Filter + Avatar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-md)',
                padding: 'var(--sp-sm) 0 var(--sp-md)',
                position: 'relative',
                zIndex: 500,
            }}>
                <div
                    className="search-bar"
                    style={{ flex: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/search')}
                >
                    <Zap size={16} color="var(--c-amber)" />
                    <span style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-base)' }}>
                        Find your next meal...
                    </span>
                </div>
                <button
                    className="btn btn-icon"
                    onClick={() => setShowFilter(true)}
                    style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border-light)' }}
                >
                    <SlidersHorizontal size={18} color="var(--c-text-secondary)" />
                </button>
                <div
                    className="avatar"
                    onClick={() => navigate('/profile')}
                    style={{ cursor: 'pointer' }}
                >
                    {currentUser?.display_name?.[0]?.toUpperCase() || <User size={16} />}
                </div>
            </div>

            {/* Quick filter chips */}
            <div style={{
                display: 'flex',
                gap: 'var(--sp-sm)',
                padding: '0 0 var(--sp-md)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
            }}>
                {QUICK_FILTERS.map((chip) => (
                    <button
                        key={chip.id}
                        className={`chip ${activeChip === chip.id ? 'chip-active' : 'chip-default'}`}
                        onClick={() => setActiveChip(chip.id)}
                    >
                        {chip.icon && <span style={{ fontSize: '0.8rem' }}>{chip.icon}</span>}
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* Map */}
            <div style={{
                flex: '0 0 auto',
                height: '42vh',
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                border: '1px solid var(--c-border-light)',
                marginBottom: 'var(--sp-lg)',
            }}>
                {campus && (
                    <MapContainer
                        center={[campus.lat, campus.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {todayPopups.map((popup) => (
                            <Marker
                                key={popup.id}
                                position={[popup.lat, popup.lng]}
                                icon={createPinIcon(popup.title.split(' ').slice(0, 2).join(' '))}
                                eventHandlers={{ click: () => navigate(`/popup/${popup.id}`) }}
                            >
                                <Popup>
                                    <div style={{ minWidth: 150 }}>
                                        <strong>{popup.title}</strong>
                                        <div className="flex items-center gap-xs" style={{ marginTop: 6, color: 'var(--c-text-secondary)', fontSize: 'var(--fs-xs)' }}>
                                            <Clock size={10} />
                                            {popup.start_time}–{popup.end_time}
                                        </div>
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 4 }}>
                                            {getCreator(popup.creator_id)?.name}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>

            {/* Happening Now section header */}
            <div className="section-header">
                <p className="section-title" style={{
                    color: 'var(--c-amber)',
                    borderBottom: '2px solid var(--c-amber)',
                    paddingBottom: 'var(--sp-xs)',
                }}>
                    Happening Now
                </p>
                <button className="section-link" onClick={() => navigate('/trending')}>
                    View All
                </button>
            </div>

            {/* Featured popup card */}
            {featuredPopup && (
                <div
                    className="featured-card"
                    onClick={() => navigate(`/popup/${featuredPopup.id}`)}
                    style={{ marginBottom: 'var(--sp-base)' }}
                >
                    <div
                        className="featured-card-image"
                        style={{
                            background: `linear-gradient(135deg, var(--c-surface) 0%, rgba(232,149,42,0.1) 100%)`,
                        }}
                    >
                        <span>{foodEmoji(featuredPopup.food_type)}</span>
                        {/* Badges */}
                        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 'var(--sp-sm)' }}>
                            {featuredPopup.until_sold_out && (
                                <span className="badge badge-live">Limited Drop</span>
                            )}
                            {getPopupRsvps(featuredPopup.id).length > 10 && (
                                <span className="badge badge-live">High Demand</span>
                            )}
                        </div>
                    </div>
                    <div className="featured-card-body">
                        <div className="flex items-center justify-between">
                            <h3>{featuredPopup.title}</h3>
                            <span className="badge badge-live">
                                {getPopupRsvps(featuredPopup.id).length} RSVPs
                            </span>
                        </div>
                        <p>
                            {getCreator(featuredPopup.creator_id)?.name} • {featuredPopup.location_name} • Ending in {featuredPopup.end_time}
                        </p>
                        <button
                            className="btn btn-outline btn-full"
                            style={{ marginTop: 'var(--sp-md)', letterSpacing: 'var(--ls-wider)' }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/popup/${featuredPopup.id}`); }}
                        >
                            Reserve Now
                        </button>
                    </div>
                </div>
            )}

            {/* Rest of popups as event cards */}
            <div className="flex flex-col gap-md">
                {todayPopups.slice(1).map((popup) => (
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
                            <p>
                                {popup.start_time} • {popup.location_name}
                            </p>
                        </div>
                        <span className="badge badge-rsvp">
                            {getPopupRsvps(popup.id).length} RSVPs
                        </span>
                    </div>
                ))}
            </div>

            {/* FAB */}
            {currentUser?.creator_id && (
                <button className="fab" onClick={() => navigate('/creator/new')}>
                    <Plus size={24} />
                </button>
            )}

            {showFilter && (
                <FilterDrawer filters={filters} setFilters={setFilters} onClose={() => setShowFilter(false)} />
            )}

            <BottomNav />
        </div>
    );
}
