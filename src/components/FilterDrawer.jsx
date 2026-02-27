import { X, RotateCcw } from 'lucide-react';
import { foodTypeOptions } from '../data/seedData';

export default function FilterDrawer({ filters, setFilters, onClose }) {
    const dietaryOptions = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Organic'];

    const handleReset = () => {
        setFilters({ date: '', food_type: '', dietary: '', zip: '' });
    };

    return (
        <>
            <div className="drawer-overlay" onClick={onClose} />
            <div className="drawer">
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-2xl)' }}>
                    <h3 className="heading-display" style={{ fontSize: 'var(--fs-lg)' }}>Filters</h3>
                    <button className="btn btn-icon btn-ghost" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-xl">
                    <div className="input-group">
                        <label className="input-label">Date</label>
                        <input
                            type="date"
                            className="input"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Food Type</label>
                        <select
                            className="select"
                            value={filters.food_type}
                            onChange={(e) => setFilters({ ...filters, food_type: e.target.value })}
                        >
                            <option value="">All Types</option>
                            {foodTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Dietary</label>
                        <select
                            className="select"
                            value={filters.dietary}
                            onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
                        >
                            <option value="">Any</option>
                            {dietaryOptions.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Zip Code</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. 78712"
                            value={filters.zip}
                            onChange={(e) => setFilters({ ...filters, zip: e.target.value })}
                            maxLength={5}
                        />
                    </div>

                    <div className="flex flex-col gap-md" style={{ marginTop: 'var(--sp-lg)' }}>
                        <button className="btn btn-primary btn-full btn-lg" onClick={onClose}>
                            Apply Filters
                        </button>
                        <button className="btn btn-ghost btn-full" onClick={handleReset}>
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
