import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Trash2, MapPin } from 'lucide-react';

export default function CreatePopupPage() {
    const navigate = useNavigate();
    const { createPopup, currentUser, campuses } = useApp();
    const campus = campuses.find((c) => c.id === currentUser?.campus_id);

    const [form, setForm] = useState({
        title: '', food_type: 'Mexican', start_date: '', end_date: '',
        start_time: '', end_time: '', location_name: '', address: '',
        until_sold_out: false,
    });
    const [dietaryTags, setDietaryTags] = useState([]);
    const [menuItems, setMenuItems] = useState([{ name: '', price: '' }]);
    const [error, setError] = useState('');

    const dietaryOptions = ['Vegan', 'Vegetarian Options', 'Gluten-Free', 'Halal Options', 'Organic', 'Nut-Free'];

    const toggleTag = (tag) => {
        setDietaryTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.start_date || !form.start_time || !form.end_time || !form.location_name) {
            setError('Please fill in all required fields');
            return;
        }
        createPopup({
            ...form,
            end_date: form.end_date || form.start_date,
            creator_id: currentUser.creator_id,
            campus_id: currentUser.campus_id,
            dietary_tags: dietaryTags,
            menu: menuItems.filter((m) => m.name).map((m) => m.name),
            prices: menuItems.filter((m) => m.name).map((m) => m.price || 'Market'),
            lat: campus ? campus.lat + (Math.random() - 0.5) * 0.006 : 30.285,
            lng: campus ? campus.lng + (Math.random() - 0.5) * 0.006 : -97.735,
            photos: [],
        });
        navigate('/creator');
    };

    return (
        <div className="page" style={{ gap: 'var(--sp-lg)' }}>
            <div className="flex items-center gap-md">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
                <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>Create Popup</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                <div className="input-group">
                    <label className="input-label">Title *</label>
                    <input className="input" placeholder="e.g. Taco Tuesday Fiesta" value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="input-group">
                    <label className="input-label">Food Type</label>
                    <select className="select" value={form.food_type}
                        onChange={(e) => setForm({ ...form, food_type: e.target.value })}>
                        <option value="Mexican">Mexican</option><option value="BBQ">BBQ</option>
                        <option value="Healthy">Healthy</option><option value="Asian">Asian</option>
                        <option value="Italian">Italian</option><option value="Other">Other</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Dietary Tags</label>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                        {dietaryOptions.map((tag) => (
                            <button key={tag} type="button" className={'tag' + (dietaryTags.includes(tag) ? '' : '')}
                                style={{
                                    cursor: 'pointer',
                                    background: dietaryTags.includes(tag) ? 'rgba(255,107,53,0.2)' : 'var(--c-surface)',
                                    borderColor: dietaryTags.includes(tag) ? 'var(--c-accent)' : 'var(--c-border)',
                                    color: dietaryTags.includes(tag) ? 'var(--c-accent)' : 'var(--c-text-secondary)',
                                }}
                                onClick={() => toggleTag(tag)}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-md">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Start Date *</label>
                        <input type="date" className="input" value={form.start_date}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">End Date</label>
                        <input type="date" className="input" value={form.end_date}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                </div>
                <div className="flex gap-md">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Start Time *</label>
                        <input type="time" className="input" value={form.start_time}
                            onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">End Time *</label>
                        <input type="time" className="input" value={form.end_time}
                            onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-label"><MapPin size={14} style={{ display: 'inline' }} /> Location Name *</label>
                    <input className="input" placeholder="e.g. Gregory Gym Plaza" value={form.location_name}
                        onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
                </div>
                <div className="input-group">
                    <label className="input-label">Address</label>
                    <input className="input" placeholder="e.g. 2101 Speedway, Austin TX" value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-md)' }}>
                        <label className="input-label">Menu Items</label>
                        <button type="button" className="btn btn-ghost btn-sm"
                            onClick={() => setMenuItems([...menuItems, { name: '', price: '' }])}>
                            <Plus size={14} />Add
                        </button>
                    </div>
                    <div className="flex flex-col gap-md">
                        {menuItems.map((item, i) => (
                            <div key={i} className="flex gap-sm items-center">
                                <input className="input" placeholder="Item name" value={item.name} style={{ flex: 2 }}
                                    onChange={(e) => { const n = [...menuItems]; n[i].name = e.target.value; setMenuItems(n); }} />
                                <input className="input" placeholder="Price" value={item.price} style={{ flex: 1 }}
                                    onChange={(e) => { const n = [...menuItems]; n[i].price = e.target.value; setMenuItems(n); }} />
                                {menuItems.length > 1 && (
                                    <button type="button" className="btn btn-icon btn-ghost" onClick={() => setMenuItems(menuItems.filter((_, idx) => idx !== i))}>
                                        <Trash2 size={16} color="var(--c-error)" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <label className="flex items-center gap-md" style={{ cursor: 'pointer' }}>
                    <div className={'toggle' + (form.until_sold_out ? ' active' : '')}
                        onClick={() => setForm({ ...form, until_sold_out: !form.until_sold_out })} />
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>Serving until sold out</span>
                </label>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="btn btn-primary btn-full btn-lg">Publish Popup</button>
            </form>
        </div>
    );
}
