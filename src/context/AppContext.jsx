import { createContext, useContext, useReducer, useCallback } from 'react';
import {
    campuses as seedCampuses,
    users as seedUsers,
    creators as seedCreators,
    popups as seedPopups,
    rsvps as seedRsvps,
    reviews as seedReviews,
    reports as seedReports,
} from '../data/seedData';

const AppContext = createContext(null);

const initialState = {
    currentUser: null,
    campuses: seedCampuses,
    users: seedUsers,
    creators: seedCreators,
    popups: seedPopups,
    rsvps: seedRsvps,
    reviews: seedReviews,
    reports: seedReports,
};

function appReducer(state, action) {
    switch (action.type) {
        case 'LOGIN': {
            const { email, password, role } = action.payload;
            const existing = state.users.find(
                (u) => u.email === email && u.password === password
            );
            if (existing) {
                return { ...state, currentUser: existing };
            }
            const newUser = {
                id: 'user-' + Date.now(),
                email,
                password,
                role,
                campus_id: null,
                display_name: email.split('@')[0],
                following: [],
            };
            if (role === 'creator') {
                newUser.creator_id = 'creator-' + Date.now();
            }
            const newCreators =
                role === 'creator'
                    ? [
                        ...state.creators,
                        {
                            id: newUser.creator_id,
                            user_id: newUser.id,
                            name: newUser.display_name + "'s Kitchen",
                            bio: 'New creator on campus!',
                            avatar: '👨‍🍳',
                            followers: [],
                        },
                    ]
                    : state.creators;
            return {
                ...state,
                currentUser: newUser,
                users: [...state.users, newUser],
                creators: newCreators,
            };
        }

        case 'LOGOUT':
            return { ...state, currentUser: null };

        case 'SELECT_CAMPUS':
            return {
                ...state,
                currentUser: { ...state.currentUser, campus_id: action.payload },
            };

        case 'CREATE_POPUP': {
            const popup = {
                ...action.payload,
                id: 'popup-' + Date.now(),
                attendance: 0,
                status: 'upcoming',
            };
            return { ...state, popups: [...state.popups, popup] };
        }

        case 'RSVP': {
            const { popup_id, status } = action.payload;
            const existingIdx = state.rsvps.findIndex(
                (r) => r.user_id === state.currentUser.id && r.popup_id === popup_id
            );
            if (existingIdx >= 0) {
                const updated = [...state.rsvps];
                updated[existingIdx] = { ...updated[existingIdx], status };
                return { ...state, rsvps: updated };
            }
            return {
                ...state,
                rsvps: [
                    ...state.rsvps,
                    {
                        id: 'rsvp-' + Date.now(),
                        user_id: state.currentUser.id,
                        popup_id,
                        status,
                        reminder: false,
                    },
                ],
            };
        }

        case 'TOGGLE_REMINDER': {
            const { rsvp_id } = action.payload;
            return {
                ...state,
                rsvps: state.rsvps.map((r) =>
                    r.id === rsvp_id ? { ...r, reminder: !r.reminder } : r
                ),
            };
        }

        case 'CANCEL_RSVP': {
            const { popup_id } = action.payload;
            return {
                ...state,
                rsvps: state.rsvps.filter(
                    (r) =>
                        !(r.user_id === state.currentUser.id && r.popup_id === popup_id)
                ),
            };
        }

        case 'ADD_REVIEW': {
            const review = {
                ...action.payload,
                id: 'review-' + Date.now(),
                user_id: state.currentUser.id,
            };
            return { ...state, reviews: [...state.reviews, review] };
        }

        case 'ADD_REPORT': {
            const report = {
                ...action.payload,
                id: 'report-' + Date.now(),
                user_id: state.currentUser.id,
            };
            return { ...state, reports: [...state.reports, report] };
        }

        case 'FOLLOW_CREATOR': {
            const creatorId = action.payload;
            const following = state.currentUser.following.includes(creatorId)
                ? state.currentUser.following.filter((id) => id !== creatorId)
                : [...state.currentUser.following, creatorId];

            const updatedCreators = state.creators.map((c) => {
                if (c.id === creatorId) {
                    const isFollowing = state.currentUser.following.includes(creatorId);
                    return {
                        ...c,
                        followers: isFollowing
                            ? c.followers.filter((id) => id !== state.currentUser.id)
                            : [...c.followers, state.currentUser.id],
                    };
                }
                return c;
            });

            return {
                ...state,
                currentUser: { ...state.currentUser, following },
                creators: updatedCreators,
            };
        }

        case 'SET_ATTENDANCE': {
            const { popup_id, count } = action.payload;
            return {
                ...state,
                popups: state.popups.map((p) =>
                    p.id === popup_id ? { ...p, attendance: count, status: 'past' } : p
                ),
            };
        }

        case 'UPDATE_PROFILE': {
            const { display_name, bio, avatar, interests, quiz_answers, profile_photo, creator_name, creator_bio } = action.payload;
            const updatedUser = {
                ...state.currentUser,
                display_name: display_name || state.currentUser.display_name,
                bio: bio !== undefined ? bio : state.currentUser.bio,
                avatar: avatar || state.currentUser.avatar,
                interests: interests || state.currentUser.interests || [],
                quiz_answers: quiz_answers || state.currentUser.quiz_answers || {},
                profile_photo: profile_photo !== undefined ? profile_photo : state.currentUser.profile_photo,
            };
            let updatedCreators = state.creators;
            if (state.currentUser.role === 'creator' && state.currentUser.creator_id) {
                updatedCreators = state.creators.map((c) =>
                    c.id === state.currentUser.creator_id
                        ? { ...c, name: creator_name || c.name, bio: creator_bio !== undefined ? creator_bio : c.bio }
                        : c
                );
            }
            return { ...state, currentUser: updatedUser, creators: updatedCreators };
        }

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const login = useCallback(
        (email, password, role) =>
            dispatch({ type: 'LOGIN', payload: { email, password, role } }),
        []
    );
    const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
    const selectCampus = useCallback(
        (campusId) => dispatch({ type: 'SELECT_CAMPUS', payload: campusId }),
        []
    );
    const createPopup = useCallback(
        (popup) => dispatch({ type: 'CREATE_POPUP', payload: popup }),
        []
    );
    const rsvp = useCallback(
        (popup_id, status) =>
            dispatch({ type: 'RSVP', payload: { popup_id, status } }),
        []
    );
    const toggleReminder = useCallback(
        (rsvp_id) =>
            dispatch({ type: 'TOGGLE_REMINDER', payload: { rsvp_id } }),
        []
    );
    const cancelRsvp = useCallback(
        (popup_id) =>
            dispatch({ type: 'CANCEL_RSVP', payload: { popup_id } }),
        []
    );
    const addReview = useCallback(
        (review) => dispatch({ type: 'ADD_REVIEW', payload: review }),
        []
    );
    const addReport = useCallback(
        (report) => dispatch({ type: 'ADD_REPORT', payload: report }),
        []
    );
    const followCreator = useCallback(
        (creatorId) => dispatch({ type: 'FOLLOW_CREATOR', payload: creatorId }),
        []
    );
    const setAttendance = useCallback(
        (popup_id, count) =>
            dispatch({ type: 'SET_ATTENDANCE', payload: { popup_id, count } }),
        []
    );
    const updateProfile = useCallback(
        (profileData) => dispatch({ type: 'UPDATE_PROFILE', payload: profileData }),
        []
    );

    const getCreator = useCallback(
        (creatorId) => state.creators.find((c) => c.id === creatorId),
        [state.creators]
    );
    const getPopupRsvps = useCallback(
        (popupId) => state.rsvps.filter((r) => r.popup_id === popupId),
        [state.rsvps]
    );
    const getPopupReviews = useCallback(
        (popupId) => state.reviews.filter((r) => r.popup_id === popupId),
        [state.reviews]
    );
    const getUserRsvp = useCallback(
        (popupId) =>
            state.rsvps.find(
                (r) =>
                    r.user_id === state.currentUser?.id && r.popup_id === popupId
            ),
        [state.rsvps, state.currentUser]
    );
    const getAvgRating = useCallback(
        (popupId) => {
            const popReviews = state.reviews.filter((r) => r.popup_id === popupId);
            if (popReviews.length === 0) return 0;
            return (
                popReviews.reduce((sum, r) => sum + r.rating, 0) / popReviews.length
            );
        },
        [state.reviews]
    );
    const getTrendingScore = useCallback(
        (popup) => {
            const rsvpCount = state.rsvps.filter(
                (r) => r.popup_id === popup.id
            ).length;
            const avg = getAvgRating(popup.id);
            return rsvpCount * (popup.attendance || 1) * (avg || 1);
        },
        [state.rsvps, getAvgRating]
    );

    const value = {
        ...state,
        login,
        logout,
        selectCampus,
        createPopup,
        rsvp,
        toggleReminder,
        cancelRsvp,
        addReview,
        addReport,
        followCreator,
        setAttendance,
        updateProfile,
        getCreator,
        getPopupRsvps,
        getPopupReviews,
        getUserRsvp,
        getAvgRating,
        getTrendingScore,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
