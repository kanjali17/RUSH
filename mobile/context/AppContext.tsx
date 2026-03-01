import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
    campuses as seedCampuses,
    users as seedUsers,
    creators as seedCreators,
    popups as seedPopups,
    rsvps as seedRsvps,
    reviews as seedReviews,
    reports as seedReports,
} from '../data/seedData';

export interface PopupMenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface Popup {
    id: string;
    creator_id: string;
    campus_id: string;
    title: string;
    description?: string;
    location_name: string;
    lat: number;
    lng: number;
    date?: string;
    time_range?: string;
    status: 'upcoming' | 'active' | 'past';
    attendance: number;
    capacity?: number;
    menu?: PopupMenuItem[];
    image_url?: string;
    // Legacy/Seed fields
    food_type?: string;
    dietary_tags?: string[];
    start_time?: string;
    end_time?: string;
    start_date?: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'EVENT_FOLLOW' | 'RSVP_REMINDER';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    data?: any;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    role: string;
    campus_id: string | null;
    display_name: string;
    avatar?: string;
    bio?: string;
    following: string[];
    instagram_handle?: string;
    profile_photo?: string;
    interests?: string[];
    quiz_answers?: any;
}

export interface Creator {
    id: string;
    user_id: string;
    name: string;
    bio: string;
    avatar: string;
    followers: string[];
    email?: string;
    instagram_handle?: string;
}

export interface UserPost {
    id: string;
    user_id: string;
    image_url: string;
    caption: string;
    timestamp: string;
}

export interface Rumor {
    id: string;
    user_id: string;
    content: string;
    timeframe: string;
    timestamp: string;
}

export interface AppState {
    currentUser: User | null;
    campuses: any[];
    users: User[];
    creators: Creator[];
    popups: Popup[];
    posts: UserPost[];
    rumors: Rumor[]; // New field
    rsvps: any[];
    reviews: any[];
    reports: any[];
    notifications: Notification[];
    hasLaunched: boolean;
}

export interface AppContextType extends AppState {
    login: (email: string, password: string, role: string) => void;
    logout: () => void;
    selectCampus: (campusId: string) => void;
    createPopup: (popup: any) => void;
    createPost: (post: { image_url: string; caption: string }) => void;
    startRumor: (rumor: { content: string; timeframe: string }) => void; // New action
    rsvp: (popup_id: string, status: string) => void;
    toggleReminder: (rsvp_id: string) => void;
    cancelRsvp: (popup_id: string) => void;
    addReview: (review: any) => void;
    addReport: (report: any) => void;
    followCreator: (creatorId: string) => void;
    setAttendance: (popup_id: string, count: number) => void;
    updateProfile: (profileData: any) => void;
    getCreator: (creatorId: string) => Creator | undefined;
    getPopupRsvps: (popupId: string) => any[];
    hasLaunched: boolean;
    setHasLaunched: (val: boolean) => void;
    getPopupReviews: (popupId: string) => any[];
    getUserRsvp: (popupId: string) => any;
    getAvgRating: (popupId: string) => number;
    getTrendingScore: (popup: any) => number;
    markNotificationRead: (notificationId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
    currentUser: null,
    campuses: seedCampuses,
    users: seedUsers as any,
    creators: seedCreators as any,
    popups: seedPopups.map((p, i) => {
        const popup: Popup = {
            ...p,
            status: p.status as any,
            description: p.food_type, // Fallback
            date: p.start_date,
            time_range: `${p.start_time} - ${p.end_time}`,
            capacity: 60,
            menu: i === 0 ? [
                { id: 'm1', name: 'Truffle Infused Grains', price: 14, description: 'Wild forest mushrooms, essence of white truffle' },
                { id: 'm2', name: 'Seared Seasonal Veggies', price: 12, description: 'Farm-to-table root vegetables, herb charcoal' },
                { id: 'm3', name: 'Citrus Glaze Reduction', price: 4, description: 'Aged balsamic, blood orange zest' }
            ] : [
                { id: 'mx', name: 'Standard Bowl', price: 12, description: 'Delicious ingredients mixed perfectly' }
            ]
        };
        return popup;
    }),
    rsvps: seedRsvps,
    reviews: seedReviews,
    reports: seedReports,
    notifications: [
        {
            id: 'n1',
            user_id: 'user-1',
            type: 'EVENT_FOLLOW',
            title: 'New Event: Taco Tuesday',
            message: "Maria's Kitchen just posted a new event at Gregory Gym Plaza!",
            timestamp: new Date().toISOString(),
            read: false,
            data: { popup_id: 'popup-1' }
        },
        {
            id: 'n2',
            user_id: 'user-1',
            type: 'RSVP_REMINDER',
            title: 'RSVP Reminder',
            message: 'Your RSVP for Acai Morning is in 1 hour!',
            timestamp: new Date().toISOString(),
            read: false,
            data: { popup_id: 'popup-3' }
        }
    ],
    posts: [],
    rumors: [],
    hasLaunched: false,
};

function appReducer(state: AppState, action: any): AppState {
    switch (action.type) {
        case 'CREATE_POST': {
            const newPost: UserPost = {
                id: 'post-' + Date.now(),
                user_id: state.currentUser?.id || 'anonymous',
                image_url: action.payload.image_url,
                caption: action.payload.caption,
                timestamp: new Date().toISOString(),
            };
            return { ...state, posts: [newPost, ...state.posts] };
        }
        case 'START_RUMOR': {
            const newRumor: Rumor = {
                id: 'rumor-' + Date.now(),
                user_id: state.currentUser?.id || 'anonymous',
                content: action.payload.content,
                timeframe: action.payload.timeframe,
                timestamp: new Date().toISOString(),
            };

            // Broadcast to followers (mocking this by adding a notification for the current user too for visibility)
            const notification: Notification = {
                id: 'n-rumor-' + Date.now(),
                user_id: state.currentUser?.id || 'anonymous',
                type: 'EVENT_FOLLOW',
                title: '🕵️ RUMOR DETECTED',
                message: `${state.currentUser?.display_name || 'A creator'} just teased a drop: "${action.payload.content}" happening ${action.payload.timeframe}`,
                timestamp: new Date().toISOString(),
                read: false,
                data: { rumor_id: newRumor.id }
            };

            return {
                ...state,
                rumors: [newRumor, ...state.rumors],
                notifications: [notification, ...state.notifications]
            };
        }
        case 'SET_LAUNCHED':
            return { ...state, hasLaunched: action.payload };
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
                (newUser as any).creator_id = 'creator-' + Date.now();
            }
            const newCreators =
                role === 'creator'
                    ? [
                        ...state.creators,
                        {
                            id: (newUser as any).creator_id,
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
                currentUser: { ...state.currentUser, campus_id: action.payload } as any,
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
                (r) => r.user_id === state.currentUser?.id && r.popup_id === popup_id
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
                        user_id: state.currentUser?.id,
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
                        !(r.user_id === state.currentUser?.id && r.popup_id === popup_id)
                ),
            };
        }

        case 'ADD_REVIEW': {
            const review = {
                ...action.payload,
                id: 'review-' + Date.now(),
                user_id: state.currentUser?.id,
            };
            return { ...state, reviews: [...state.reviews, review] };
        }

        case 'ADD_REPORT': {
            const report = {
                ...action.payload,
                id: 'report-' + Date.now(),
                user_id: state.currentUser?.id,
            };
            return { ...state, reports: [...state.reports, report] };
        }

        case 'FOLLOW_CREATOR': {
            const user = state.currentUser;
            if (!user) return state;

            const isFollowing = user.following.includes(action.payload);
            const updatedFollowing = isFollowing
                ? user.following.filter((id) => id !== action.payload)
                : [...user.following, action.payload];

            const updatedUser = { ...user, following: updatedFollowing };
            const updatedCreators = state.creators.map((c) =>
                c.id === action.payload
                    ? {
                        ...c,
                        followers: isFollowing
                            ? c.followers.filter((fid) => fid !== user.id)
                            : [...c.followers, user.id]
                    }
                    : c
            );
            return {
                ...state,
                currentUser: updatedUser as any,
                creators: updatedCreators as any,
                users: state.users.map((u) => u.id === user.id ? updatedUser : u)
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
            const { display_name, bio, avatar, interests, quiz_answers, profile_photo, instagram_handle, creator_name, creator_bio, creator_email, creator_insta } = action.payload;
            const user = state.currentUser as any;
            const updatedUser = {
                ...user,
                display_name: display_name || user?.display_name,
                bio: bio !== undefined ? bio : user?.bio,
                avatar: avatar || user?.avatar,
                interests: interests || user?.interests || [],
                quiz_answers: quiz_answers || user?.quiz_answers || {},
                profile_photo: profile_photo !== undefined ? profile_photo : user?.profile_photo,
                instagram_handle: instagram_handle !== undefined ? instagram_handle : user?.instagram_handle,
                email: action.payload.email || user?.email,
            };
            let updatedCreators = state.creators;
            if (user?.role === 'creator' && user?.creator_id) {
                updatedCreators = state.creators.map((c) =>
                    c.id === user.creator_id
                        ? {
                            ...c,
                            name: creator_name || c.name,
                            bio: creator_bio !== undefined ? creator_bio : c.bio,
                            email: creator_email || c.email,
                            instagram_handle: creator_insta || c.instagram_handle
                        }
                        : c
                );
            }
            return { ...state, currentUser: updatedUser as any, creators: updatedCreators };
        }

        case 'MARK_NOTIFICATION_READ': {
            return {
                ...state,
                notifications: state.notifications.map((n) =>
                    n.id === action.payload ? { ...n, read: true } : n
                ),
            };
        }
        default:
            return state;
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const login = useCallback(
        (email: string, password: string, role: string) =>
            dispatch({ type: 'LOGIN', payload: { email, password, role } }),
        []
    );
    const setHasLaunched = useCallback(
        (val: boolean) => dispatch({ type: 'SET_LAUNCHED', payload: val }),
        []
    );
    const logout = useCallback(() => {
        dispatch({ type: 'LOGOUT' });
        setHasLaunched(false); // Reset launch state on logout as well? User said "every time you open the app"
    }, [setHasLaunched]);
    const selectCampus = useCallback(
        (campusId: string) => dispatch({ type: 'SELECT_CAMPUS', payload: campusId }),
        []
    );
    const createPopup = useCallback(
        (popup: any) => dispatch({ type: 'CREATE_POPUP', payload: popup }),
        []
    );
    const createPost = useCallback(
        (post: { image_url: string; caption: string }) => dispatch({ type: 'CREATE_POST', payload: post }),
        []
    );
    const startRumor = useCallback(
        (rumor: { content: string; timeframe: string }) => dispatch({ type: 'START_RUMOR', payload: rumor }),
        []
    );
    const rsvp = useCallback(
        (popup_id: string, status: string) =>
            dispatch({ type: 'RSVP', payload: { popup_id, status } }),
        []
    );
    const toggleReminder = useCallback(
        (rsvp_id: string) =>
            dispatch({ type: 'TOGGLE_REMINDER', payload: { rsvp_id } }),
        []
    );
    const cancelRsvp = useCallback(
        (popup_id: string) =>
            dispatch({ type: 'CANCEL_RSVP', payload: { popup_id } }),
        []
    );
    const addReview = useCallback(
        (review: any) => dispatch({ type: 'ADD_REVIEW', payload: review }),
        []
    );
    const addReport = useCallback(
        (report: any) => dispatch({ type: 'ADD_REPORT', payload: report }),
        []
    );
    const followCreator = useCallback(
        (creatorId: string) => dispatch({ type: 'FOLLOW_CREATOR', payload: creatorId }),
        []
    );
    const setAttendance = useCallback(
        (popup_id: string, count: number) =>
            dispatch({ type: 'SET_ATTENDANCE', payload: { popup_id, count } }),
        []
    );
    const updateProfile = useCallback(
        (profileData: any) => dispatch({ type: 'UPDATE_PROFILE', payload: profileData }),
        []
    );

    const getCreator = useCallback(
        (creatorId: string) => state.creators.find((c) => c.id === creatorId),
        [state.creators]
    );
    const getPopupRsvps = useCallback(
        (popupId: string) => state.rsvps.filter((r) => r.popup_id === popupId),
        [state.rsvps]
    );
    const getPopupReviews = useCallback(
        (popupId: string) => state.reviews.filter((r) => r.popup_id === popupId),
        [state.reviews]
    );
    const getUserRsvp = useCallback(
        (popupId: string) =>
            state.rsvps.find(
                (r) =>
                    r.user_id === state.currentUser?.id && r.popup_id === popupId
            ),
        [state.rsvps, state.currentUser]
    );
    const getAvgRating = useCallback(
        (popupId: string) => {
            const popReviews = state.reviews.filter((r) => r.popup_id === popupId);
            if (popReviews.length === 0) return 0;
            return (
                popReviews.reduce((sum, r) => sum + r.rating, 0) / popReviews.length
            );
        },
        [state.reviews]
    );
    const getTrendingScore = useCallback(
        (popup: any) => {
            const rsvpCount = state.rsvps.filter(
                (r) => r.popup_id === popup.id
            ).length;
            const avg = getAvgRating(popup.id);
            return rsvpCount * (popup.attendance || 1) * (avg || 1);
        },
        [state.rsvps, getAvgRating]
    );

    const markNotificationRead = useCallback(
        (notificationId: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId }),
        []
    );

    const value: AppContextType = {
        ...state,
        login,
        logout,
        selectCampus,
        createPopup,
        createPost,
        startRumor,
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
        markNotificationRead,
        hasLaunched: state.hasLaunched,
        setHasLaunched,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
