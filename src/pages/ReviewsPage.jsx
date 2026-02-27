import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Send } from 'lucide-react';

export default function ReviewsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { popups, getPopupReviews, addReview, currentUser } = useApp();

    const popup = popups.find((p) => p.id === id);
    const reviews = getPopupReviews(id);

    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (rating === 0) return;
        addReview({ popup_id: id, rating, text });
        setRating(0);
        setText('');
    };

    if (!popup) {
        return (
            <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <p>Popup not found</p>
            </div>
        );
    }

    return (
        <div className="page page-compact" style={{ gap: 'var(--sp-lg)' }}>
            {/* Header */}
            <div className="top-bar">
                <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </button>
                <div style={{ flex: 1 }}>
                    <p className="label-uppercase">Feedback</p>
                    <h1 className="heading-display" style={{ fontSize: 'var(--fs-xl)' }}>
                        Reviews
                    </h1>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>
                        {popup.title}
                    </p>
                </div>
            </div>

            {/* Write Review — any user can review */}
            {currentUser && (
                <div className="card flex flex-col gap-md">
                    <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                        Leave a Review
                    </p>
                    <div className="stars" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span
                                key={s}
                                className={`star ${s <= (hoverRating || rating) ? 'filled' : ''}`}
                                onClick={() => setRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{ cursor: 'pointer', transition: 'transform var(--t-fast)' }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        className="input"
                        placeholder="Share your experience..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        style={{ resize: 'none' }}
                    />
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSubmit}
                        style={{ alignSelf: 'flex-end', opacity: rating > 0 ? 1 : 0.5 }}
                        disabled={rating === 0}
                    >
                        <Send size={14} />
                        Submit
                    </button>
                </div>
            )}

            {/* Reviews List */}
            <div className="flex flex-col gap-md">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="card">
                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-sm)' }}>
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className={`star ${s <= review.rating ? 'filled' : ''}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
                                {review.text}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center" style={{ padding: 'var(--sp-3xl) 0', color: 'var(--c-text-muted)' }}>
                        <Star size={48} style={{ margin: '0 auto var(--sp-lg)', opacity: 0.3 }} />
                        <p>No reviews yet</p>
                        <p style={{ fontSize: 'var(--fs-sm)', marginTop: 'var(--sp-sm)' }}>
                            Be the first to review!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
