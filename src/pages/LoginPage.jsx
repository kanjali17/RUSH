import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Mail, KeyRound, Lock } from 'lucide-react';

const STEPS = { SPLASH: -1, EMAIL: 0, VERIFY: 1, PASSWORD: 2 };

export default function LoginPage() {
    const { login, register, currentUser } = useApp();
    const navigate = useNavigate();

    const [step, setStep] = useState(STEPS.SPLASH);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState('');

    const handleEmailSubmit = () => {
        setError('');
        if (!email.endsWith('.edu')) {
            setError('Please use a valid .edu email address');
            return;
        }
        if (isLogin) {
            setStep(STEPS.PASSWORD);
        } else {
            const code = String(Math.floor(1000 + Math.random() * 9000));
            setGeneratedCode(code);
            setStep(STEPS.VERIFY);
        }
    };

    const handleVerify = () => {
        setError('');
        if (verifyCode !== generatedCode) {
            setError('Incorrect code. Please try again.');
            return;
        }
        setStep(STEPS.PASSWORD);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!password || password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }
        if (isLogin) {
            login(email, password);
            navigate('/campus');
        } else {
            if (!displayName) {
                setError('Please enter your name');
                return;
            }
            register({ email, password, display_name: displayName, interests: [] });
            navigate('/interests');
        }
    };

    // ─── SPLASH SCREEN ───
    if (step === STEPS.SPLASH) {
        return (
            <div
                className="page"
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 'var(--sp-2xl)',
                    background: `
            radial-gradient(circle at 50% 30%, rgba(232,149,42,0.08) 0%, transparent 50%),
            var(--c-bg)
          `,
                    overflow: 'hidden',
                }}
            >
                {/* Ambient glow rings */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(232,149,42,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }} />

                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <p className="label-uppercase" style={{ marginBottom: 'var(--sp-base)', opacity: 0.9 }}>
                        Campus Exclusive
                    </p>

                    <h1
                        className="heading-display"
                        style={{
                            fontSize: 'clamp(3rem, 12vw, 5rem)',
                            color: 'var(--c-amber)',
                            textShadow: '0 0 60px rgba(232,149,42,0.3)',
                            marginBottom: 'var(--sp-base)',
                        }}
                    >
                        PopUp<br />Finder
                    </h1>

                    <p style={{
                        color: 'var(--c-text-muted)',
                        fontSize: 'var(--fs-base)',
                        fontFamily: 'var(--ff-display)',
                        letterSpacing: 'var(--ls-wide)',
                    }}>
                        The Underground Refined.
                    </p>
                </div>

                <div style={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    marginTop: 'var(--sp-xl)',
                }}>
                    <p style={{
                        fontSize: 'var(--fs-lg)',
                        color: 'var(--c-text-secondary)',
                        lineHeight: 'var(--lh-snug)',
                        marginBottom: 'var(--sp-3xl)',
                    }}>
                        Curated meals for<br />
                        <strong style={{ color: 'var(--c-text)' }}>the inner circle.</strong>
                    </p>

                    <button
                        className="btn btn-primary btn-lg btn-full"
                        onClick={() => setStep(STEPS.EMAIL)}
                        style={{
                            fontSize: 'var(--fs-base)',
                            padding: 'var(--sp-lg) var(--sp-2xl)',
                            borderRadius: 'var(--r-xl)',
                            animation: 'glow-pulse 3s ease infinite',
                        }}
                    >
                        Get Started
                    </button>

                    <div className="flex items-center justify-center gap-sm" style={{
                        marginTop: 'var(--sp-xl)',
                        color: 'var(--c-text-muted)',
                        fontSize: 'var(--fs-xs)',
                        letterSpacing: 'var(--ls-wide)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--ff-display)',
                    }}>
                        <Lock size={12} />
                        University Verification Required
                    </div>
                </div>
            </div>
        );
    }

    // ─── AUTH FLOW ───
    return (
        <div
            className="page"
            style={{
                justifyContent: 'center',
                gap: 'var(--sp-2xl)',
                background: `
          radial-gradient(circle at 50% 20%, rgba(232,149,42,0.06) 0%, transparent 50%),
          var(--c-bg)
        `,
            }}
        >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-sm">
                {(isLogin ? [0, 1] : [0, 1, 2]).map((s) => (
                    <div
                        key={s}
                        style={{
                            width: (isLogin ? (s === step) : (s === step)) ? 28 : 8,
                            height: 6,
                            borderRadius: 'var(--r-full)',
                            background: s <= step ? 'var(--c-amber)' : 'var(--c-surface-active)',
                            transition: 'all var(--t-base)',
                        }}
                    />
                ))}
            </div>

            <div style={{ textAlign: 'center' }}>
                <p className="label-uppercase" style={{ marginBottom: 'var(--sp-sm)' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </p>
                <h2 className="heading-display" style={{ fontSize: 'var(--fs-2xl)' }}>
                    {step === STEPS.EMAIL && 'Enter your email'}
                    {step === STEPS.VERIFY && 'Verify your email'}
                    {step === STEPS.PASSWORD && (isLogin ? 'Enter password' : 'Almost there')}
                </h2>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (step === STEPS.EMAIL) handleEmailSubmit();
                    else if (step === STEPS.VERIFY) handleVerify();
                    else handleFinalSubmit(e);
                }}
                className="flex flex-col gap-lg"
                style={{ animation: 'fadeIn 0.3s ease' }}
            >
                {step === STEPS.EMAIL && (
                    <>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className={`input ${error ? 'input-error' : ''}`}
                                placeholder="yourname@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn btn-primary btn-full btn-lg">
                            Continue
                            <ArrowRight size={18} />
                        </button>
                    </>
                )}

                {step === STEPS.VERIFY && (
                    <>
                        <div
                            className="card"
                            style={{
                                background: 'linear-gradient(135deg, rgba(52,199,89,0.08) 0%, transparent 100%)',
                                border: '1px solid rgba(52,199,89,0.15)',
                                textAlign: 'center',
                            }}
                        >
                            <ShieldCheck size={28} color="var(--c-success)" style={{ margin: '0 auto var(--sp-sm)' }} />
                            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
                                Code sent to <strong style={{ color: 'var(--c-text)' }}>{email}</strong>
                            </p>
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 'var(--sp-xs)' }}>
                                Demo code: <strong style={{ color: 'var(--c-success)' }}>{generatedCode}</strong>
                            </p>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Verification Code</label>
                            <input
                                type="text"
                                className={`input ${error ? 'input-error' : ''}`}
                                placeholder="0000"
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value)}
                                maxLength={4}
                                autoFocus
                                style={{
                                    textAlign: 'center',
                                    fontSize: 'var(--fs-2xl)',
                                    fontWeight: 'var(--fw-bold)',
                                    fontFamily: 'var(--ff-display)',
                                    letterSpacing: '0.3em',
                                }}
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn btn-primary btn-full btn-lg">
                            Verify
                            <ShieldCheck size={18} />
                        </button>
                    </>
                )}

                {step === STEPS.PASSWORD && (
                    <>
                        {!isLogin && (
                            <div className="input-group">
                                <label className="input-label">Your Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="What should we call you?"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus={isLogin}
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="btn btn-primary btn-full btn-lg">
                            {isLogin ? 'Log In' : 'Create Account'}
                            <ArrowRight size={18} />
                        </button>
                    </>
                )}
            </form>

            <p className="text-center" style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                    onClick={() => { setIsLogin(!isLogin); setStep(STEPS.EMAIL); setError(''); }}
                    style={{ color: 'var(--c-amber)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
    );
}
