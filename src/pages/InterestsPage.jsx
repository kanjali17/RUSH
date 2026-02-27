import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { interestOptions } from '../data/seedData';
import { Sparkles, ArrowRight, SkipForward } from 'lucide-react';

export default function InterestsPage() {
    const { updateProfile, currentUser } = useApp();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(currentUser?.interests || []);

    const toggle = (interest) => {
        setSelected((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const handleContinue = () => {
        updateProfile({ interests: selected });
        navigate('/campus');
    };

    return (
        <div className="page" style={{
            gap: 'var(--sp-2xl)',
            background: `
        radial-gradient(circle at 50% 20%, rgba(232,149,42,0.06) 0%, transparent 50%),
        var(--c-bg)
      `,
        }}>
            <div style={{ textAlign: 'center', paddingTop: 'var(--sp-xl)' }}>
                <div style={{
                    width: 56,
                    height: 56,
                    margin: '0 auto var(--sp-lg)',
                    background: 'var(--c-amber-glow)',
                    borderRadius: 'var(--r-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Sparkles size={26} color="var(--c-amber)" />
                </div>
                <p className="label-uppercase" style={{ marginBottom: 'var(--sp-sm)' }}>
                    Personalize
                </p>
                <h1 className="heading-display" style={{ fontSize: 'var(--fs-2xl)' }}>
                    What are you into?
                </h1>
                <p style={{ color: 'var(--c-text-secondary)', fontSize: 'var(--fs-sm)', marginTop: 'var(--sp-sm)' }}>
                    Pick your favorites to personalize your feed
                </p>
            </div>

            <div className="flex gap-sm flex-wrap" style={{ justifyContent: 'center' }}>
                {interestOptions.map((interest) => {
                    const isSelected = selected.includes(interest);
                    return (
                        <button
                            key={interest}
                            className={`chip ${isSelected ? 'chip-active' : 'chip-default'}`}
                            onClick={() => toggle(interest)}
                            style={{
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            {interest}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col gap-md mt-auto" style={{ paddingBottom: 'var(--sp-xl)' }}>
                <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                    style={{ opacity: selected.length > 0 ? 1 : 0.5 }}
                >
                    Continue
                    <ArrowRight size={18} />
                </button>
                <button
                    className="btn btn-ghost btn-full"
                    onClick={() => navigate('/campus')}
                >
                    <SkipForward size={14} /> Skip for now
                </button>
            </div>
        </div>
    );
}
