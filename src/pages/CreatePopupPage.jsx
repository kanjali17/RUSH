import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { foodTypeOptions } from '../data/seedData';
import { ArrowLeft, Upload } from 'lucide-react';

export default function CreatePopupPage() {
    const { createPopup, currentUser, campuses, getMyCreator } = useApp();
    const navigate = useNavigate();
    const creator = getMyCreator();
    const campus = campuses.find((c) => c.id === currentUser?.campus_id);

    const [form, setForm] = useState({
        title: '', food_type: '', dietary_tags: [],
        start_date: '', end_date: '', start_time: '', end_time: '',
        location_name: '', address: '', menu: '', prices: '',
        until_sold_out: false,
    });

    const dietaryOptions = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Organic'];

    const toggleDietary = (tag) => {
        setForm((f) => ({
            ...f,
            dietary_tags: f.dietary_tags.includes(tag)
                ? f.dietary_tags.filter((t) => t !== tag)
                : [...f.dietary_tags, tag],
        }));
    };

    if (!creator) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-lg)' }}>
                <p style={{ color: 'var(--c-text-secondary)' }}>You need a creator profile first</p>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                    Set Up Creator Profile
                </button>
            </div>
        );
    }

    const handlePublish = (e) => {
        e.preventDefault();
        if (!form.title || !form.start_date || !form.start_time || !form.location_name) {
            alert('Please fill in required fields');
            return;
        }
        const menuItems = form.menu.split(',').map((s) => s.trim()).filter(Boolean);
        const priceItems = form.prices.split(',').map((s) => s.trim()).filter(Boolean);

        createPopup({
            creator_id: creator.id,
            campus_id: currentUser.campus_id,
            title: form.title, food_type: form.food_type,
            dietary_tags: form.dietary_tags,
            start_date: form.start_date, end_date: form.end_date || form.start_date,
            start_time: form.start_time, end_time: form.end_time || '',
            location_name: form.location_name, address: form.address,
            zip: campus?.zip || '',
            lat: campus?.lat + (Math.random() - 0.5) * 0.005,
            lng: campus?.lng + (Math.random() - 0.5) * 0.005,
            menu: menuItems, prices: priceItems,
            photos: [], until_sold_out: form.until_sold_out,
        });
        navigate('/creator');
    };

    return (
        <div className="page page-compact" style={{ gap: 'var(--sp-lg)' }}>
            <div className="top-bar">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </button>
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase">New</p>
                    <h1 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>Create Pop-Up</h1>
                </div>
            </div>

            <form onSubmit={handlePublish} className="flex flex-col gap-lg">
                <div className="input-group">
                    <label className="input-label">Title *</label>
                    <input className="input" placeholder="e.g. Taco Tuesday Fiesta 🌮" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>

                <div className="input-group">
                    <label className="input-label">Food Type</label>
                    <select className="select" value={form.food_type} onChange={(e) => setForm({ ...form, food_type: e.target.value })}>
                        <option value="">Select type</option>
                        {foodTypeOptions.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label">Dietary Tags</label>
                    <div className="flex gap-sm flex-wrap">
                        {dietaryOptions.map((tag) => (
                            <button key={tag} type="button" className={`chip ${form.dietary_tags.includes(tag) ? 'chip-active' : 'chip-default'}`} onClick={() => toggleDietary(tag)}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-md">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Start Date *</label>
                        <input type="date" className="input" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">End Date</label>
                        <input type="date" className="input" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                </div>

                <div className="flex gap-md">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Start Time *</label>
                        <input type="time" className="input" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">End Time</label>
                        <input type="time" className="input" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Location Name *</label>
                    <input className="input" placeholder="e.g. Gregory Gym Plaza" value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
                </div>

                <div className="input-group">
                    <label className="input-label">Address</label>
                    <input className="input" placeholder="Full address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>

                <div className="input-group">
                    <label className="input-label">Menu Items (comma-separated)</label>
                    <input className="input" placeholder="Tacos, Elote, Horchata" value={form.menu} onChange={(e) => setForm({ ...form, menu: e.target.value })} />
                </div>

                <div className="input-group">
                    <label className="input-label">Prices (comma-separated)</label>
                    <input className="input" placeholder="$3, $4, $2" value={form.prices} onChange={(e) => setForm({ ...form, prices: e.target.value })} />
                </div>

                <div className="flex items-center justify-between" style={{ background: 'var(--c-surface)', padding: 'var(--sp-base)', borderRadius: 'var(--r-lg)' }}>
                    <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Until Sold Out</span>
                    <div className={`toggle ${form.until_sold_out ? 'active' : ''}`} onClick={() => setForm({ ...form, until_sold_out: !form.until_sold_out })} />
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                    <Upload size={18} /> Publish
                </button>
            </form>
        </div>
    );
}
