import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, Clock, LocateFixed, Search, X, Loader } from 'lucide-react';
import FilterDrawer from '../components/FilterDrawer';
import BottomNav from '../components/BottomNav';
import 'leaflet/dist/leaflet.css';

function createPinIcon(title) {
    return L.divIcon({
        className: '',
        html: '<div class="custom-pin">' + title + '</div>',
        iconSize: [0, 0],
        iconAnchor: [0, 30],
        popupAnchor: [0, -35],
    });
}

const userPinIcon = L.divIcon({
    className: '',
    html: `<div style="
        width: 18px; height: 18px; border-radius: 50%;
        background: #4A90FF; border: 3px solid #fff;
        box-shadow: 0 0 12px rgba(74,144,255,0.6), 0 0 24px rgba(74,144,255,0.3);
        animation: pulse 2s ease-in-out infinite;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

const searchPinIcon = L.divIcon({
    className: '',
    html: `<div style="
        width: 22px; height: 22px; border-radius: 50%;
        background: #FF4A6E; border: 3px solid #fff;
        box-shadow: 0 0 12px rgba(255,74,110,0.6), 0 0 24px rgba(255,74,110,0.3);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

function FlyToLocation({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { duration: 1.2 });
        }
    }, [position, map]);
    return null;
}

export default function HomePage() {
    const { popups, currentUser, getCreator, getPopupRsvps, campuses } = useApp();
    const navigate = useNavigate();
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({ date: '', food_type: '', dietary: '' });
    const [userLocation, setUserLocation] = useState(null);
    const [locating, setLocating] = useState(false);
    const [flyTarget, setFlyTarget] = useState(null);

    // Address search state
    const [showSearch, setShowSearch] = useState(false);
    const [addressQuery, setAddressQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchPin, setSearchPin] = useState(null);
    const [searchLabel, setSearchLabel] = useState('');
    const [searchError, setSearchError] = useState('');

    const campus = campuses.find((c) => c.id === currentUser?.campus_id);

    // Try to get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                () => { },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        }
    }, []);

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(loc);
                setFlyTarget(loc);
                setLocating(false);
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleAddressSearch = async (e) => {
        e.preventDefault();
        if (!addressQuery.trim()) return;
        setSearching(true);
        setSearchError('');
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`,
                { headers: { 'Accept': 'application/json' } }
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const loc = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                setSearchPin(loc);
                setSearchLabel(data[0].display_name.split(',').slice(0, 2).join(','));
                setFlyTarget(loc);
                setShowSearch(false);
                setAddressQuery('');
            } else {
                setSearchError('Address not found. Try a different search.');
            }
        } catch {
            setSearchError('Could not search. Check your connection.');
        }
        setSearching(false);
    };

    const clearSearchPin = () => {
        setSearchPin(null);
        setSearchLabel('');
    };

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
        return filtered;
    }, [popups, currentUser, filters]);

    return (
        <div className="page page-with-nav" style={{ padding: 0, gap: 0 }}>
            {/* Top Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)',
                padding: 'var(--sp-base) var(--sp-lg)', background: 'var(--c-bg-glass)',
                backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--c-border)',
                position: 'relative', zIndex: 500,
            }}>
                <h2 style={{ flex: 1, fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
                    {campus?.campus_name || 'Campus'}
                </h2>
                <button className="btn btn-icon btn-ghost" onClick={() => setShowSearch(!showSearch)}
                    style={{ color: showSearch ? 'var(--c-accent)' : undefined }}>
                    <Search size={20} />
                </button>
                <button className="btn btn-icon btn-ghost" onClick={handleLocateMe}
                    style={{ color: locating ? 'var(--c-accent)' : undefined, animation: locating ? 'pulse 1s infinite' : 'none' }}>
                    <LocateFixed size={20} />
                </button>
                <button className="btn btn-icon btn-ghost" onClick={() => setShowFilter(true)}>
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            {/* Address Search Bar */}
            {showSearch && (
                <div style={{
                    padding: 'var(--sp-sm) var(--sp-lg)', background: 'var(--c-bg-glass)',
                    backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--c-border)',
                    position: 'relative', zIndex: 499,
                    animation: 'fadeIn 0.2s ease',
                }}>
                    <form onSubmit={handleAddressSearch} className="flex gap-sm items-center">
                        <input
                            type="text" className="input" autoFocus
                            placeholder="Enter an address..."
                            value={addressQuery}
                            onChange={(e) => { setAddressQuery(e.target.value); setSearchError(''); }}
                            style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
                        />
                        <button type="submit" className="btn btn-primary btn-sm" disabled={searching || !addressQuery.trim()}
                            style={{ minWidth: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            {searching ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
                            Go
                        </button>
                        <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => { setShowSearch(false); setSearchError(''); }}>
                            <X size={16} />
                        </button>
                    </form>
                    {searchError && (
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-error)', marginTop: 'var(--sp-xs)' }}>{searchError}</p>
                    )}
                </div>
            )}

            {/* Search Pin Indicator */}
            {searchPin && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)',
                    padding: 'var(--sp-xs) var(--sp-lg)',
                    background: 'rgba(255,74,110,0.1)', borderBottom: '1px solid rgba(255,74,110,0.2)',
                    zIndex: 498,
                }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%', background: '#FF4A6E', flexShrink: 0,
                    }} />
                    <span style={{ flex: 1, fontSize: 'var(--fs-xs)', color: 'var(--c-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Showing popups near: <strong style={{ color: 'var(--c-text)' }}>{searchLabel}</strong>
                    </span>
                    <button className="btn btn-ghost btn-sm" onClick={clearSearchPin}
                        style={{ fontSize: 'var(--fs-xs)', padding: '2px 8px', color: 'var(--c-error)' }}>
                        Clear
                    </button>
                </div>
            )}

            {/* Map */}
            <div style={{ flex: 1, position: 'relative' }}>
                {campus && (
                    <MapContainer center={[campus.lat, campus.lng]} zoom={15}
                        style={{ height: '100%', width: '100%', minHeight: '70vh' }} zoomControl={false}>
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {/* Fly to location */}
                        {flyTarget && <FlyToLocation position={flyTarget} />}

                        {/* User Location Pin */}
                        {userLocation && (
                            <Marker position={userLocation} icon={userPinIcon}>
                                <Popup>
                                    <div style={{ textAlign: 'center', minWidth: 100 }}>
                                        <strong style={{ color: '#4A90FF' }}>📍 You are here</strong>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Search Location Pin */}
                        {searchPin && (
                            <Marker position={searchPin} icon={searchPinIcon}>
                                <Popup>
                                    <div style={{ textAlign: 'center', minWidth: 120 }}>
                                        <strong style={{ color: '#FF4A6E' }}>📍 {searchLabel}</strong>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Popup Pins */}
                        {todayPopups.map((popup) => (
                            <Marker key={popup.id} position={[popup.lat, popup.lng]}
                                icon={createPinIcon(popup.title.split(' ').slice(0, 2).join(' '))}
                                eventHandlers={{ click: () => navigate('/popup/' + popup.id) }}>
                                <Popup>
                                    <div style={{ minWidth: 160 }}>
                                        <strong>{popup.title}</strong>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: 'var(--c-text-secondary)', fontSize: 'var(--fs-xs)' }}>
                                            <Clock size={12} />{popup.start_time} - {popup.end_time}
                                        </div>
                                        <div style={{ fontSize: 'var(--fs-xs)', marginTop: 4, color: 'var(--c-text-secondary)' }}>
                                            {getCreator(popup.creator_id)?.name}
                                        </div>
                                        <div style={{ fontSize: 'var(--fs-xs)', marginTop: 4, color: 'var(--c-text-accent)' }}>
                                            {getPopupRsvps(popup.id).length} RSVPs
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
            {showFilter && <FilterDrawer filters={filters} setFilters={setFilters} onClose={() => setShowFilter(false)} />}
            <BottomNav />
        </div>
    );
}
