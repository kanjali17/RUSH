import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import {
    User, Mail, LogOut, Heart, ChefHat, Plus,
    Sparkles, Edit3, Settings, ArrowRight,
} from 'lucide-react';
import { interestOptions } from '../data/seedData';

export default function ProfilePage() {
    const { currentUser, getMyCreator, logout, updateProfile, becomeCreator } = useApp();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(currentUser?.display_name || '');
    const [editBio, setEditBio] = useState(currentUser?.bio || '');
    const [showCreatorSetup, setShowCreatorSetup] = useState(false);
    const [creatorName, setCreatorName] = useState('');
    const [creatorBio, setCreatorBio] = useState('');

    const myCreator = getMyCreator();

    const handleSaveProfile = () => {
        updateProfile({ display_name: editName, bio: editBio });
        setEditing(false);
    };

    const handleBecomeCreator = () => {
        if (!creatorName) return;
        becomeCreator(creatorName, creatorBio);
        setShowCreatorSetup(false);
    };

    const handleLogout = () => { logout(); navigate('/'); };

    if (!currentUser) return null;

    return (
        <div className="page page-with-nav page-compact" style={{ gap: 'var(--sp-lg)' }}>
            {/* Header */}
            <div className="top-bar">
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase">Profile</p>
                </div>
            </div>

            {/* Avatar + Info */}
            <div className="text-center" style={{ paddingTop: 'var(--sp-sm)' }}>
                <div className="avatar-xl" style={{
                    margin: '0 auto var(--sp-base)',
                    background: 'linear-gradient(135deg, var(--c-amber) 0%, var(--c-amber-dark) 100%)',
                    color: '#000',
                    fontWeight: 'var(--fw-bold)',
                }}>
                    {currentUser.display_name?.[0]?.toUpperCase() || '?'}
                </div>

                {editing ? (
                    <div className="flex flex-col gap-md" style={{ textAlign: 'left' }}>
                        <div className="input-group">
                            <label className="input-label">Name</label>
                            <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Bio</label>
                            <input className="input" value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tell us about yourself" />
                        </div>
                        <div className="flex gap-md">
                            <button className="btn btn-primary btn-sm" onClick={handleSaveProfile}>Save</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>
                            {currentUser.display_name}
                        </h2>
                        {currentUser.bio && (
                            <p style={{ color: 'var(--c-text-secondary)', fontSize: 'var(--fs-sm)', marginTop: 'var(--sp-xs)' }}>
                                {currentUser.bio}
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-xs" style={{ marginTop: 'var(--sp-sm)', color: 'var(--c-text-muted)', fontSize: 'var(--fs-xs)' }}>
                            <Mail size={12} /> {currentUser.email}
                        </div>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} style={{ marginTop: 'var(--sp-md)' }}>
                            <Edit3 size={14} /> Edit Profile
                        </button>
                    </>
                )}
            </div>

            {/* Interests */}
            <div className="card">
                <p className="section-title" style={{ marginBottom: 'var(--sp-md)' }}>
                    <Sparkles size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--c-amber)' }} />
                    Your Interests
                </p>
                <div className="flex gap-sm flex-wrap">
                    {currentUser.interests?.length > 0 ? (
                        currentUser.interests.map((interest) => (
                            <span key={interest} className="tag">{interest}</span>
                        ))
                    ) : (
                        <p style={{ color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)' }}>No interests set yet</p>
                    )}
                </div>
            </div>

            {/* Creator Section */}
            <div className="card">
                <p className="section-title" style={{ marginBottom: 'var(--sp-md)' }}>
                    <ChefHat size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--c-amber)' }} />
                    Creator Tools
                </p>

                {myCreator ? (
                    <div className="flex flex-col gap-md">
                        <div className="event-card" style={{ cursor: 'default', border: 'none', background: 'var(--c-bg)' }}>
                            <div className="avatar">{myCreator.avatar}</div>
                            <div className="event-card-info">
                                <h4>{myCreator.name}</h4>
                                <p>{myCreator.followers.length} followers</p>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-full" onClick={() => navigate('/creator')}>
                            <Settings size={16} /> Creator Dashboard
                        </button>
                        <button className="btn btn-outline btn-full" onClick={() => navigate('/creator/new')}>
                            <Plus size={16} /> Create New Popup
                        </button>
                    </div>
                ) : showCreatorSetup ? (
                    <div className="flex flex-col gap-md">
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
                            Set up your creator profile to start hosting popups!
                        </p>
                        <div className="input-group">
                            <label className="input-label">Brand Name</label>
                            <input className="input" placeholder="e.g. Taco Express" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Short Bio</label>
                            <input className="input" placeholder="What do you make?" value={creatorBio} onChange={(e) => setCreatorBio(e.target.value)} />
                        </div>
                        <div className="flex gap-md">
                            <button className="btn btn-primary" onClick={handleBecomeCreator}>Create Profile</button>
                            <button className="btn btn-ghost" onClick={() => setShowCreatorSetup(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button className="btn btn-outline btn-full" onClick={() => setShowCreatorSetup(true)}>
                        <Plus size={16} /> Become a Creator
                    </button>
                )}
            </div>

            {/* Saved / Following */}
            <div className="event-card" onClick={() => navigate('/following')} style={{ cursor: 'pointer' }}>
                <Heart size={20} color="var(--c-amber)" />
                <div className="event-card-info">
                    <h4>Following</h4>
                    <p>{currentUser.following?.length || 0} creators</p>
                </div>
                <ArrowRight size={16} color="var(--c-text-muted)" />
            </div>

            {/* Logout */}
            <button className="btn btn-ghost btn-full" onClick={handleLogout} style={{ color: 'var(--c-error)', marginTop: 'var(--sp-sm)' }}>
                <LogOut size={16} /> Log Out
            </button>

            <BottomNav />
        </div>
    );
}
