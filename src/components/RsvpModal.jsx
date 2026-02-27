import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Bell, BellOff, X } from 'lucide-react';

export default function RsvpModal({ popup, onClose }) {
    const { rsvp, getUserRsvp, toggleReminder, cancelRsvp } = useApp();
    const existingRsvp = getUserRsvp(popup.id);
    const [confirmed, setConfirmed] = useState(!!existingRsvp);

    const handleGoing = () => {
        rsvp(popup.id, 'going');
        setConfirmed(true);
    };

    const handleInterested = () => {
        rsvp(popup.id, 'interested');
        setConfirmed(true);
    };

    const handleCancel = () => {
        cancelRsvp(popup.id);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle" />

                {confirmed || existingRsvp ? (
                    <div className="text-center flex flex-col gap-lg" style={{ padding: 'var(--sp-lg) 0' }}>
                        <div style={{ animation: 'bounceIn 0.5s ease' }}>
                            <CheckCircle
                                size={64}
                                color="var(--c-success)"
                                style={{ margin: '0 auto' }}
                            />
                        </div>
                        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>
                            {existingRsvp?.status === 'going' || (!existingRsvp && confirmed)
                                ? "You're Going! ✅"
                                : 'Marked as Interested ✨'}
                        </h2>
                        <p style={{ color: 'var(--c-text-secondary)' }}>
                            {popup.title}
                        </p>

                        {/* Reminder Toggle */}
                        {existingRsvp && (
                            <div
                                className="flex items-center justify-between"
                                style={{
                                    background: 'var(--c-surface)',
                                    padding: 'var(--sp-base)',
                                    borderRadius: 'var(--r-lg)',
                                }}
                            >
                                <div className="flex items-center gap-md">
                                    {existingRsvp.reminder ? (
                                        <Bell size={18} color="var(--c-amber)" />
                                    ) : (
                                        <BellOff size={18} color="var(--c-text-muted)" />
                                    )}
                                    <span style={{ fontSize: 'var(--fs-sm)' }}>Reminder</span>
                                </div>
                                <div
                                    className={`toggle ${existingRsvp.reminder ? 'active' : ''}`}
                                    onClick={() => toggleReminder(existingRsvp.id)}
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-md">
                            <button className="btn btn-primary btn-full" onClick={onClose}>
                                Done
                            </button>
                            <button className="btn btn-ghost btn-full" onClick={handleCancel} style={{ color: 'var(--c-error)' }}>
                                Cancel RSVP
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-lg" style={{ padding: 'var(--sp-md) 0' }}>
                        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>
                            RSVP to {popup.title}
                        </h2>

                        <button className="btn btn-primary btn-full btn-lg" onClick={handleGoing}>
                            ✅ I'm Going!
                        </button>

                        <button className="btn btn-secondary btn-full btn-lg" onClick={handleInterested}>
                            ✨ Interested
                        </button>

                        <button className="btn btn-ghost btn-full" onClick={onClose}>
                            Maybe Later
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
