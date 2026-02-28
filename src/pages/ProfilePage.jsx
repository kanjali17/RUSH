import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Camera, Save, LogOut, ChevronRight, Sparkles, Edit3, Check } from 'lucide-react';

const AVATARS = ['😊', '😎', '🤠', '🧑‍🍳', '👩‍🍳', '👨‍🍳', '🦊', '🐻', '🌮', '🍕', '🍔', '🥗', '🧁', '🍣', '🌯', '🥙'];

const FOOD_INTERESTS = [
    'Mexican', 'BBQ', 'Healthy', 'Asian', 'Italian', 'Indian',
    'Mediterranean', 'Vegan', 'Desserts', 'Coffee', 'Smoothies', 'Sushi',
    'Pizza', 'Street Food', 'Comfort Food', 'Fusion',
];

const QUIZ_QUESTIONS = [
    {
        question: 'What is your go-to campus meal vibe?',
        options: ['Quick Bite', 'Full Meal', 'Snack Run', 'Coffee & Pastry'],
    },
    {
        question: 'How adventurous are you with food?',
        options: ['Try Everything!', 'Open Minded', 'Stick to What I Know', 'Depends on My Mood'],
    },
    {
        question: 'Spice tolerance?',
        options: ['Bring the Heat!', 'Medium is Perfect', 'Mild Please', 'No Spice at All'],
    },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const { currentUser, creators, logout, updateProfile } = useApp();
    const isCreator = currentUser?.role === 'creator';
    const creator = isCreator ? creators.find((c) => c.id === currentUser?.creator_id) : null;

    const [editing, setEditing] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [avatar, setAvatar] = useState(currentUser?.avatar || '😊');
    const [interests, setInterests] = useState(currentUser?.interests || []);
    const [quizAnswers, setQuizAnswers] = useState(currentUser?.quiz_answers || {});
    const [profilePhoto, setProfilePhoto] = useState(currentUser?.profile_photo || null);

    // For creator-specific fields
    const [creatorName, setCreatorName] = useState(creator?.name || '');
    const [creatorBio, setCreatorBio] = useState(creator?.bio || '');

    const fileInputRef = useRef(null);

    const toggleInterest = (interest) => {
        setInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
        );
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateProfile({
            display_name: displayName,
            bio,
            avatar,
            interests,
            quiz_answers: quizAnswers,
            profile_photo: profilePhoto,
            // Creator-specific
            creator_name: creatorName,
            creator_bio: creatorBio,
        });
        setEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="page page-with-nav" style={{ gap: 'var(--sp-lg)' }}>
            {/* Profile Header */}
            <div style={{ textAlign: 'center', paddingTop: 'var(--sp-lg)' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div
                        onClick={() => editing && (profilePhoto ? fileInputRef.current?.click() : setShowAvatarPicker(true))}
                        style={{
                            width: 96, height: 96, borderRadius: 'var(--r-full)',
                            background: profilePhoto ? 'none' : 'var(--gradient-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', margin: '0 auto', cursor: editing ? 'pointer' : 'default',
                            boxShadow: 'var(--shadow-glow-strong)',
                            backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            border: '3px solid var(--c-accent)',
                            transition: 'all var(--t-base)',
                        }}
                    >
                        {!profilePhoto && avatar}
                    </div>
                    {editing && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                position: 'absolute', bottom: 0, right: -4,
                                width: 32, height: 32, borderRadius: 'var(--r-full)',
                                background: 'var(--c-accent)', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid var(--c-bg)',
                                cursor: 'pointer',
                            }}
                        >
                            <Camera size={14} />
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </div>

                {editing ? (
                    <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                        style={{ textAlign: 'center', fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', marginTop: 'var(--sp-md)', maxWidth: 240, margin: 'var(--sp-md) auto 0' }}
                    />
                ) : (
                    <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', marginTop: 'var(--sp-md)' }}>{displayName}</h1>
                )}
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', marginTop: 'var(--sp-xs)' }}>{currentUser?.email}</p>
                <span className="tag" style={{ marginTop: 'var(--sp-sm)', display: 'inline-flex' }}>
                    {isCreator ? 'Creator' : 'Food Explorer'}
                </span>
            </div>

            {/* Edit / Save Toggle */}
            <div className="flex justify-center">
                {editing ? (
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>
                        <Save size={16} />Save Profile
                    </button>
                ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                        <Edit3 size={16} />Edit Profile
                    </button>
                )}
            </div>

            {/* Avatar Picker */}
            {editing && showAvatarPicker && (
                <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
                    <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)' }}>Choose Avatar</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 'var(--sp-sm)' }}>
                        {AVATARS.map((a) => (
                            <button key={a} onClick={() => { setAvatar(a); setProfilePhoto(null); setShowAvatarPicker(false); }}
                                style={{
                                    width: 40, height: 40, fontSize: '1.3rem', borderRadius: 'var(--r-md)',
                                    background: avatar === a ? 'rgba(255,107,53,0.2)' : 'var(--c-surface)',
                                    border: avatar === a ? '2px solid var(--c-accent)' : '1px solid var(--c-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                }}>{a}</button>
                        ))}
                    </div>
                    <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 'var(--sp-md)' }}
                        onClick={() => { setShowAvatarPicker(false); fileInputRef.current?.click(); }}>
                        <Camera size={14} />Upload Photo Instead
                    </button>
                </div>
            )}

            {/* Bio / Description */}
            <div className="card">
                <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)', color: 'var(--c-text-accent)' }}>
                    About Me
                </p>
                {editing ? (
                    <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell people about yourself..." rows={3}
                        style={{ resize: 'none', width: '100%' }}
                    />
                ) : (
                    <p style={{ fontSize: 'var(--fs-sm)', color: bio ? 'var(--c-text-secondary)' : 'var(--c-text-muted)' }}>
                        {bio || 'No bio yet. Tap Edit to add one!'}
                    </p>
                )}
            </div>

            {/* Creator-Specific Section */}
            {isCreator && (
                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,179,71,0.04) 100%)',
                }}>
                    <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-md)', color: 'var(--c-text-accent)' }}>
                        Creator Profile
                    </p>
                    {editing ? (
                        <div className="flex flex-col gap-md">
                            <div className="input-group">
                                <label className="input-label">Brand Name</label>
                                <input className="input" value={creatorName} onChange={(e) => setCreatorName(e.target.value)}
                                    placeholder="Your brand name" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Brand Bio</label>
                                <textarea className="input" value={creatorBio} onChange={(e) => setCreatorBio(e.target.value)}
                                    placeholder="Describe your food style..." rows={2} style={{ resize: 'none' }} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-sm">
                            <div className="flex items-center gap-sm">
                                <span style={{ fontSize: '1.2rem' }}>{creator?.avatar}</span>
                                <span style={{ fontWeight: 'var(--fw-semibold)' }}>{creator?.name}</span>
                            </div>
                            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>{creator?.bio}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Food Interests */}
            <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                    <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--c-text-accent)' }}>
                        <Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} />Food Interests
                    </p>
                    {!editing && interests.length > 0 && (
                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>{interests.length} selected</span>
                    )}
                </div>
                {editing ? (
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                        {FOOD_INTERESTS.map((interest) => (
                            <button key={interest} onClick={() => toggleInterest(interest)}
                                style={{
                                    padding: 'var(--sp-xs) var(--sp-md)', borderRadius: 'var(--r-full)',
                                    fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-medium)',
                                    cursor: 'pointer', transition: 'all var(--t-fast)',
                                    background: interests.includes(interest) ? 'rgba(255,107,53,0.2)' : 'var(--c-surface)',
                                    color: interests.includes(interest) ? 'var(--c-accent)' : 'var(--c-text-secondary)',
                                    border: `1px solid ${interests.includes(interest) ? 'var(--c-accent)' : 'var(--c-border)'}`,
                                }}>
                                {interests.includes(interest) && <Check size={10} style={{ marginRight: 4, display: 'inline' }} />}
                                {interest}
                            </button>
                        ))}
                    </div>
                ) : (
                    interests.length > 0 ? (
                        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                            {interests.map((i) => <span key={i} className="tag">{i}</span>)}
                        </div>
                    ) : (
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>No interests selected. Tap Edit to choose your favorites!</p>
                    )
                )}
            </div>

            {/* Food Personality Quiz */}
            <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                    <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--c-text-accent)' }}>
                        Food Personality Quiz
                    </p>
                    {!showQuiz && Object.keys(quizAnswers).length > 0 && (
                        <span className="tag tag-success" style={{ fontSize: 'var(--fs-xs)' }}>Completed</span>
                    )}
                </div>
                {showQuiz ? (
                    <div className="flex flex-col gap-lg">
                        {QUIZ_QUESTIONS.map((q, qi) => (
                            <div key={qi}>
                                <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', marginBottom: 'var(--sp-md)' }}>
                                    {qi + 1}. {q.question}
                                </p>
                                <div className="flex flex-col gap-sm">
                                    {q.options.map((opt) => (
                                        <button key={opt} onClick={() => setQuizAnswers({ ...quizAnswers, [qi]: opt })}
                                            style={{
                                                textAlign: 'left', padding: 'var(--sp-md)', borderRadius: 'var(--r-md)',
                                                fontSize: 'var(--fs-sm)', cursor: 'pointer', transition: 'all var(--t-fast)',
                                                background: quizAnswers[qi] === opt ? 'rgba(255,107,53,0.15)' : 'var(--c-surface)',
                                                color: quizAnswers[qi] === opt ? 'var(--c-accent)' : 'var(--c-text-secondary)',
                                                border: `1px solid ${quizAnswers[qi] === opt ? 'var(--c-accent)' : 'var(--c-border)'}`,
                                            }}>
                                            {quizAnswers[qi] === opt ? '✓ ' : ''}{opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-primary btn-full" onClick={() => setShowQuiz(false)}>Done</button>
                    </div>
                ) : (
                    <div>
                        {Object.keys(quizAnswers).length > 0 ? (
                            <div className="flex flex-col gap-sm">
                                {QUIZ_QUESTIONS.map((q, qi) => (
                                    quizAnswers[qi] && (
                                        <div key={qi} className="flex items-center justify-between" style={{ paddingBottom: 'var(--sp-sm)', borderBottom: '1px solid var(--c-border)' }}>
                                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>{q.question}</span>
                                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text)', fontWeight: 'var(--fw-medium)' }}>{quizAnswers[qi]}</span>
                                        </div>
                                    )
                                ))}
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowQuiz(true)} style={{ alignSelf: 'flex-start', marginTop: 'var(--sp-sm)' }}>
                                    Retake Quiz
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', marginBottom: 'var(--sp-md)' }}>
                                    Discover your food personality!
                                </p>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowQuiz(true)}>
                                    <Sparkles size={14} />Take the Quiz
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Logout */}
            <button className="btn btn-ghost btn-full" onClick={handleLogout}
                style={{ color: 'var(--c-error)', marginTop: 'var(--sp-lg)', marginBottom: 'var(--sp-xl)' }}>
                <LogOut size={16} />Log Out
            </button>

            <BottomNav />
        </div>
    );
}
