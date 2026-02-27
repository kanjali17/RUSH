import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PopupCard from '../components/PopupCard';
import BottomNav from '../components/BottomNav';
import { CalendarCheck } from 'lucide-react';

export default function MyRsvpsPage() {
    const { popups, rsvps, currentUser } = useApp();

    const myRsvps = useMemo(() => {
        if (!currentUser) return [];
        const myRsvpPopupIds = rsvps
            .filter((r) => r.user_id === currentUser.id)
            .map((r) => r.popup_id);
        return popups.filter(
            (p) => myRsvpPopupIds.includes(p.id) && p.status !== 'past'
        );
    }, [popups, rsvps, currentUser]);

    return (
        <div className="page page-with-nav" style={{ gap: 'var(--sp-lg)' }}>
            <div>
                <h1
                    style={{
                        fontSize: 'var(--fs-2xl)',
                        fontWeight: 'var(--fw-bold)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-sm)',
                    }}
                >
                    <CalendarCheck size={28} color="var(--c-accent)" />
                    My RSVPs
                </h1>
                <p style={{ color: 'var(--c-text-secondary)', marginTop: 'var(--sp-xs)' }}>
                    Upcoming events you're attending
                </p>
            </div>

            <div className="flex flex-col gap-md">
                {myRsvps.length > 0 ? (
                    myRsvps.map((popup) => <PopupCard key={popup.id} popup={popup} />)
                ) : (
                    <div className="text-center" style={{ padding: 'var(--sp-3xl) 0', color: 'var(--c-text-muted)' }}>
                        <CalendarCheck size={48} style={{ margin: '0 auto var(--sp-lg)', opacity: 0.3 }} />
                        <p>No upcoming RSVPs</p>
                        <p style={{ fontSize: 'var(--fs-sm)', marginTop: 'var(--sp-sm)' }}>
                            RSVP to popups to see them here
                        </p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
