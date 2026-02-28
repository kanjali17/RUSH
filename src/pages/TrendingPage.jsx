import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PopupCard from '../components/PopupCard';
import BottomNav from '../components/BottomNav';
import { Flame } from 'lucide-react';

export default function TrendingPage() {
    const { popups, getTrendingScore, currentUser } = useApp();
    const trendingPopups = useMemo(() => {
        return [...popups.filter((p) => p.campus_id === currentUser?.campus_id)]
            .sort((a, b) => getTrendingScore(b) - getTrendingScore(a));
    }, [popups, currentUser, getTrendingScore]);

    return (
        <div className="page page-with-nav" style={{ gap: 'var(--sp-lg)' }}>
            <div>
                <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                    <Flame size={28} color="var(--c-accent)" />Trending Now
                </h1>
                <p style={{ color: 'var(--c-text-secondary)', marginTop: 'var(--sp-xs)' }}>Most popular popups on campus</p>
            </div>
            <div className="flex flex-col gap-md">
                {trendingPopups.length > 0 ? trendingPopups.map((popup, i) => (
                    <div key={popup.id} style={{ position: 'relative' }}>
                        {i < 3 && <div style={{ position: 'absolute', top: -8, left: -8, zIndex: 1 }}><span className="badge">#{i + 1}</span></div>}
                        <PopupCard popup={popup} />
                    </div>
                )) : (
                    <div className="text-center" style={{ padding: 'var(--sp-3xl) 0', color: 'var(--c-text-muted)' }}>
                        <Flame size={48} style={{ margin: '0 auto var(--sp-lg)', opacity: 0.3 }} /><p>No trending popups yet</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
