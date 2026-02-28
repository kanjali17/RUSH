import { X } from 'lucide-react';

export default function FilterDrawer({ filters, setFilters, onClose }) {
    return (
        <>
            <div className="drawer-overlay" onClick={onClose} />
            <div className="drawer">
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-xl)' }}>
                    <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>Filters</h2>
                    <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="flex flex-col gap-lg">
                    <div className="input-group">
                        <label className="input-label">Date</label>
                        <input type="date" className="input" value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Food Type</label>
                        <select className="select" value={filters.food_type}
                            onChange={(e) => setFilters({ ...filters, food_type: e.target.value })}>
                            <option value="">All Types</option>
                            <option value="Mexican">Mexican</option>
                            <option value="BBQ">BBQ</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Asian">Asian</option>
                            <option value="Italian">Italian</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Dietary Tags</label>
                        <select className="select" value={filters.dietary}
                            onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}>
                            <option value="">Any</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Gluten-Free">Gluten-Free</option>
                            <option value="Halal">Halal</option>
                            <option value="Organic">Organic</option>
                        </select>
                    </div>
                    <div style={{ marginTop: 'var(--sp-lg)' }} className="flex flex-col gap-md">
                        <button className="btn btn-primary btn-full" onClick={onClose}>Apply Filters</button>
                        <button className="btn btn-ghost btn-full" onClick={() => { setFilters({ date: '', food_type: '', dietary: '' }); }}>Reset</button>
                    </div>
                </div>
            </div>
        </>
    );
}
