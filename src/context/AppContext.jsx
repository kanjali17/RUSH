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
            const { email, password } = action.payload;
            const existing = state.users.find(
                (u) => u.email === email && u.password === password
            );
            if (existing) {
                return { ...state, currentUser: existing };
            }
            return state; // Login failed
        }

        case 'REGISTER': {
            const { email, password, display_name, interests } = action.payload;
            const newUser = {
                id: `user-${Date.now()}`,
                email,
                password,
                campus_id: null,
                display_name,
                bio: '',
                interests: interests || [],
                following: [],
                creator_id: null, // Can create one later
            };
            return {
                ...state,
                currentUser: newUser,
                users: [...state.users, newUser],
            };
        }

        case 'LOGOUT':
            return { ...state, currentUser: null };

        case 'SELECT_CAMPUS':
            return {
                ...state,
                currentUser: { ...state.currentUser, campus_id: action.payload },
            };

        case 'UPDATE_PROFILE': {
            const updates = action.payload;
            const updatedUser = { ...state.currentUser, ...updates };
            return {
                ...state,
                currentUser: updatedUser,
                users: state.users.map((u) =>
                    u.id === updatedUser.id ? updatedUser : u
                ),
            };
        }

        case 'BECOME_CREATOR': {
            const { name, bio } = action.payload;
            const creatorId = `creator-${Date.now()}`;
            const newCreator = {
                id: creatorId,
                user_id: state.currentUser.id,
                name,
                bio,
                avatar: '👨‍🍳',
                followers: [],
            };
            const updatedUser = { ...state.currentUser, creator_id: creatorId };
            return {
                ...state,
                currentUser: updatedUser,
                users: state.users.map((u) =>
                    u.id === updatedUser.id ? updatedUser : u
                ),
                creators: [...state.creators, newCreator],
            };
        }

        case 'CREATE_POPUP': {
            const popup = {
                ...action.payload,
                id: `popup-${Date.now()}`,
                attendance: 0,
                status: 'upcoming',
            };
            return { ...state, popups: [...state.popups, popup] };
        }

        case 'EDIT_POPUP': {
            const { popup_id, updates } = action.payload;
            return {
                ...state,
                popups: state.popups.map((p) =>
                    p.id === popup_id ? { ...p, ...updates } : p
                ),
            };
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
                        id: `rsvp-${Date.now()}`,
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
                id: `review-${Date.now()}`,
                user_id: state.currentUser.id,
            };
            return { ...state, reviews: [...state.reviews, review] };
        }

        case 'ADD_REPORT': {
            const report = {
                ...action.payload,
                id: `report-${Date.now()}`,
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

            const updatedUser = { ...state.currentUser, following };
            return {
                ...state,
                currentUser: updatedUser,
                users: state.users.map((u) =>
                    u.id === updatedUser.id ? updatedUser : u
                ),
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

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const login = useCallback(
        (email, password) =>
            dispatch({ type: 'LOGIN', payload: { email, password } }),
        []
    );
    const register = useCallback(
        (data) => dispatch({ type: 'REGISTER', payload: data }),
        []
    );
    const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
    const selectCampus = useCallback(
        (campusId) => dispatch({ type: 'SELECT_CAMPUS', payload: campusId }),
        []
    );
    const updateProfile = useCallback(
        (updates) => dispatch({ type: 'UPDATE_PROFILE', payload: updates }),
        []
    );
    const becomeCreator = useCallback(
        (name, bio) =>
            dispatch({ type: 'BECOME_CREATOR', payload: { name, bio } }),
        []
    );
    const createPopup = useCallback(
        (popup) => dispatch({ type: 'CREATE_POPUP', payload: popup }),
        []
    );
    const editPopup = useCallback(
        (popup_id, updates) =>
            dispatch({ type: 'EDIT_POPUP', payload: { popup_id, updates } }),
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

    // Computed helpers
    const getCreator = useCallback(
        (creatorId) => state.creators.find((c) => c.id === creatorId),
        [state.creators]
    );
    const getCreatorByUserId = useCallback(
        (userId) => state.creators.find((c) => c.user_id === userId),
        [state.creators]
    );
    const getMyCreator = useCallback(
        () => state.creators.find((c) => c.id === state.currentUser?.creator_id),
        [state.creators, state.currentUser]
    );
    const isMyPopup = useCallback(
        (popup) => {
            const myCreator = state.creators.find(
                (c) => c.id === state.currentUser?.creator_id
            );
            return myCreator && popup.creator_id === myCreator.id;
        },
        [state.creators, state.currentUser]
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
        register,
        logout,
        selectCampus,
        updateProfile,
        becomeCreator,
        createPopup,
        editPopup,
        rsvp,
        toggleReminder,
        cancelRsvp,
        addReview,
        addReport,
        followCreator,
        setAttendance,
        getCreator,
        getCreatorByUserId,
        getMyCreator,
        isMyPopup,
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
