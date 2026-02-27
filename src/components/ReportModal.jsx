import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X } from 'lucide-react';

export default function ReportModal({ popup, onClose }) {
    const { addReport } = useApp();
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const reasons = [
        { value: 'not_there', label: 'Not there' },
        { value: 'unsafe', label: 'Unsafe' },
        { value: 'other', label: 'Other' },
    ];

    const handleSubmit = () => {
        if (!reason) return;
        addReport({ popup_id: popup.id, reason });
        setSubmitted(true);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle" />

                {submitted ? (
                    <div className="text-center flex flex-col gap-lg" style={{ padding: 'var(--sp-lg) 0' }}>
                        <AlertTriangle size={48} color="var(--c-warning)" style={{ margin: '0 auto' }} />
                        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>
                            Report Submitted
                        </h2>
                        <p style={{ color: 'var(--c-text-secondary)' }}>
                            Thanks for helping keep campus safe.
                        </p>
                        <button className="btn btn-primary btn-full" onClick={onClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-lg" style={{ padding: 'var(--sp-md) 0' }}>
                        <div className="flex items-center justify-between">
                            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>
                                Report Issue
                            </h2>
                            <button className="btn btn-icon btn-ghost" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <p style={{ color: 'var(--c-text-secondary)', fontSize: 'var(--fs-sm)' }}>
                            What's wrong with this popup?
                        </p>

                        <div className="flex flex-col gap-md">
                            {reasons.map((r) => (
                                <button
                                    key={r.value}
                                    className="card"
                                    onClick={() => setReason(r.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderColor:
                                            reason === r.value
                                                ? 'var(--c-amber)'
                                                : 'var(--c-border)',
                                        textAlign: 'left',
                                    }}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary btn-full"
                            onClick={handleSubmit}
                            style={{ opacity: reason ? 1 : 0.5 }}
                            disabled={!reason}
                        >
                            Submit Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
