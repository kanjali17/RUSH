import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PopupCard from '../components/PopupCard';
import BottomNav from '../components/BottomNav';
import { Heart } from 'lucide-react';

export default function FollowingPage() {
    const { popups, currentUser } = useApp();
    const followingPopups = useMemo(() => {
        if (!currentUser?.following?.length) return [];
        return popups.filter((p) => currentUser.following.includes(p.creator_id) && p.campus_id === currentUser.campus_id);
    }, [popups, currentUser]);

    return (
        <div className="page page-with-nav" style={{ gap: 'var(--sp-lg)' }}>
            <div>
                <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                    <Heart size={28} color="var(--c-accent)" />Following
                </h1>
                <p style={{ color: 'var(--c-text-secondary)', marginTop: 'var(--sp-xs)' }}>Popups from creators you follow</p>
            </div>
            <div className="flex flex-col gap-md">
                {followingPopups.length > 0 ? followingPopups.map((popup) => (
                    <PopupCard key={popup.id} popup={popup} />
                )) : (
                    <div className="text-center" style={{ padding: 'var(--sp-3xl) 0', color: 'var(--c-text-muted)' }}>
                        <Heart size={48} style={{ margin: '0 auto var(--sp-lg)', opacity: 0.3 }} />
                        <p>Follow some creators to see their popups here</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
