import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';
import { X, Clock, MapPin, Users, Heart, Share2, ChevronRight, Zap, ArrowRight, Flame } from 'lucide-react-native';
// Keep seedData for fallbacks or initial development if tables are empty
import {
    campuses as seedCampuses,
} from '../data/seedData';

export interface MenuItem {
    menu_item_id: string;
    quest_id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    is_sold_out: boolean;
}

export interface Quest {
    quest_id: string;
    creator_id: string;
    campus_id: string;
    title: string;
    description?: string;
    category?: string;
    vibe_tag?: string[];
    flyer_image_url?: string;
    start_time: string;
    end_time: string;
    location_name: string;
    location: { lat: number; lng: number }; // Transformed from PostGIS geography
    is_live: boolean;
    is_cancelled: boolean;
    capacity_limit?: number;
    price_range_min?: number;
    price_range_max?: number;
    // Computed/Joined
    stats?: QuestStats;
    menu_items?: MenuItem[];
}

export interface QuestStats {
    quest_id: string;
    rsvp_count: number;
    view_count: number;
    rumor_count: number;
    engagement_score: number;
}

export interface Campus {
    campus_id: string;
    campus_name: string;
    city: string;
    state: string;
    location: { lat: number; lng: number };
    boundary_polygon?: any;
}

export interface User {
    id: string; // Changed from user_id to id to match Supabase 'profiles' convention
    full_name: string;
    email: string;
    campus_id: string | null;
    profile_photo_url?: string;
    bio?: string;
    followers_count: number;
    following_count: number;
}

export interface UserPost {
    id: string;
    user_id: string;
    image_url: string;
    caption: string;
    timestamp: string;
}

export interface Rumor {
    rumor_id: string;
    creator_id: string;
    quest_id?: string | null;
    content_text: string;
    media_url?: string;
    media_type?: 'image' | 'video';
    expires_at?: string;
    timestamp: string;
}

export interface RSVP {
    rsvp_id: string;
    quest_id: string;
    user_id: string;
    status: 'going' | 'interested' | 'cancelled';
    created_at: string;
}

export interface Follow {
    follower_id: string;
    following_id: string;
    created_at: string;
}

export interface Notification {
    notification_id: string;
    recipient_user_id: string;
    type: string;
    reference_id?: string;
    is_read: boolean;
    created_at: string;
    title?: string; // App-side computed
    message?: string; // App-side computed
}

export interface AppState {
    currentUser: User | null;
    campuses: Campus[];
    profiles: User[];
    quests: Quest[];
    posts: UserPost[];
    rumors: Rumor[];
    rsvps: RSVP[];
    follows: Follow[];
    notifications: Notification[];
    hasLaunched: boolean;
    loading: boolean;
}

export interface AppContextType extends AppState {
    login: (email: string, password: string) => Promise<{ error: any }>;
    signup: (email: string, password: string, name: string, selectedCampusId: string | null) => Promise<{ error: any }>;
    logout: () => Promise<void>;
    selectCampus: (campusId: string) => void;
    createQuest: (quest: any) => Promise<void>;
    createPost: (post: { image_url: string; caption: string }) => Promise<{ error: any }>;
    startRumor: (rumor: any) => Promise<void>;
    rsvp: (quest_id: string, status: 'going' | 'interested' | 'cancelled') => Promise<void>;
    cancelRsvp: (quest_id: string) => Promise<void>;
    followUser: (following_id: string) => Promise<void>;
    updateProfile: (profileData: Partial<User>) => Promise<void>;
    getQuestStats: (quest_id: string) => QuestStats | undefined;
    getQuestRsvps: (quest_id: string) => RSVP[];
    setHasLaunched: (value: boolean) => void;
    resendOtp: (email: string) => Promise<{ error: any }>;
    verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
    currentUser: null,
    campuses: [],
    profiles: [],
    quests: [],
    posts: [],
    rumors: [],
    rsvps: [],
    follows: [],
    notifications: [],
    hasLaunched: false,
    loading: true,
};

function appReducer(state: AppState, action: any): AppState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_DATA':
            return { ...state, ...action.payload, loading: false };
        case 'SET_USER':
            return { ...state, currentUser: action.payload };
        case 'SET_QUESTS':
            return { ...state, quests: action.payload };
        case 'SET_PROFILES':
            return { ...state, profiles: action.payload };
        case 'SET_RSVPS':
            return { ...state, rsvps: action.payload };
        case 'SET_FOLLOWS':
            return { ...state, follows: action.payload };
        case 'CREATE_POST':
            return { ...state, posts: [action.payload, ...state.posts] };
        case 'START_RUMOR':
            return { ...state, rumors: [action.payload, ...state.rumors] };
        case 'SET_LAUNCHED':
            return { ...state, hasLaunched: action.payload };
        case 'LOGOUT':
            return { ...state, currentUser: null, loading: false };
        case 'SELECT_CAMPUS':
            return {
                ...state,
                currentUser: state.currentUser ? { ...state.currentUser, campus_id: action.payload } : null,
            };
        default:
            return state;
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const fetchInitialData = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const [
                { data: quests },
                { data: campuses },
                { data: profiles },
                { data: posts },
                { data: rsvps },
                { data: follows },
                { data: rumors },
                { data: notifications }
            ] = await Promise.all([
                supabase.from('quests').select('*, stats:quest_stats(*), menu_items(*)'),
                supabase.from('campuses').select('*'),
                supabase.from('profiles').select('*'),
                supabase.from('posts').select('*').order('timestamp', { ascending: false }),
                supabase.from('rsvps').select('*'),
                supabase.from('follows').select('*'),
                supabase.from('rumors').select('*').order('created_at', { ascending: false }),
                supabase.from('notifications').select('*').order('created_at', { ascending: false })
            ]);

            dispatch({
                type: 'SET_DATA',
                payload: {
                    quests: quests || [],
                    campuses: campuses || [],
                    profiles: profiles || [],
                    posts: posts || [],
                    rsvps: rsvps || [],
                    follows: follows || [],
                    rumors: rumors || [],
                    notifications: notifications || []
                }
            });
        } catch (error: any) {
            console.error('Error fetching initial data:', error);
            // Non-blocking warning for specific PostgREST errors (missing table)
            if (error?.code !== 'PGRST204' && error?.code !== 'PGRST205') {
                // console.log("Silent error for missing table during init");
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    useEffect(() => {
        fetchInitialData();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                dispatch({ type: 'SET_USER', payload: profile });
            } else {
                dispatch({ type: 'SET_USER', payload: null });
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchInitialData]);

    const login = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) Alert.alert('Login Error', error.message);
        return { error };
    }, []);

    const signup = useCallback(async (email: string, password: string, name: string, selectedCampusId: string | null) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    campus_id: selectedCampusId
                }
            }
        });

        if (error) {
            Alert.alert('Signup Error', error.message);
            return { error };
        }

        return { error: null };
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        dispatch({ type: 'LOGOUT' });
    }, []);

    const setHasLaunched = useCallback(
        (val: boolean) => dispatch({ type: 'SET_LAUNCHED', payload: val }),
        []
    );
    const selectCampus = useCallback(
        (campusId: string) => dispatch({ type: 'SELECT_CAMPUS', payload: campusId }),
        []
    );
    const createQuest = useCallback(async (quest: any) => {
        if (!state.currentUser) return;
        const { data, error } = await supabase
            .from('quests')
            .insert([{
                ...quest,
                creator_id: state.currentUser?.id,
                campus_id: state.currentUser?.campus_id,
                is_live: true,
                is_cancelled: false
            }])
            .select('*, stats:quest_stats(*), menu_items(*)')
            .single();

        if (error) {
            Alert.alert('Error', 'Failed to create quest: ' + error.message);
        } else {
            dispatch({ type: 'SET_DATA', payload: { ...state, quests: [data, ...state.quests] } });
        }
    }, [state]);

    const createPost = useCallback(async (post: { image_url: string; caption: string }) => {
        if (!state.currentUser) return { error: { message: 'No user logged in' } };
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                ...post,
                user_id: state.currentUser.id,
                timestamp: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            Alert.alert('Error', 'Failed to create post: ' + error.message);
            return { error };
        } else {
            dispatch({ type: 'CREATE_POST', payload: data });
            return { error: null };
        }
    }, [state.currentUser]);

    const startRumor = useCallback(async (rumor: any) => {
        if (!state.currentUser) return;
        const { data, error } = await supabase
            .from('rumors')
            .insert([{
                ...rumor,
                creator_id: state.currentUser.id,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            Alert.alert('Error', 'Failed to start rumor: ' + error.message);
        } else {
            dispatch({ type: 'START_RUMOR', payload: data });
        }
    }, [state.currentUser]);

    const rsvp = useCallback(async (quest_id: string, status: 'going' | 'interested' | 'cancelled') => {
        if (!state.currentUser) return;

        const { data, error } = await supabase
            .from('rsvps')
            .upsert({
                user_id: state.currentUser.id,
                quest_id,
                status
            }, { onConflict: 'user_id,quest_id' })
            .select()
            .single();

        if (error) {
            Alert.alert('RSVP Error', error.message);
        } else {
            const updatedRsvps = state.rsvps.filter(r => !(r.user_id === state.currentUser?.id && r.quest_id === quest_id));
            dispatch({ type: 'SET_RSVPS', payload: [...updatedRsvps, data] });
        }
    }, [state.currentUser, state.rsvps]);

    const cancelRsvp = useCallback(async (quest_id: string) => {
        if (!state.currentUser) return;

        const { error } = await supabase
            .from('rsvps')
            .delete()
            .eq('user_id', state.currentUser.id)
            .eq('quest_id', quest_id);

        if (!error) {
            dispatch({ type: 'SET_RSVPS', payload: state.rsvps.filter(r => !(r.user_id === state.currentUser?.id && r.quest_id === quest_id)) });
        }
    }, [state.currentUser, state.rsvps]);

    const followUser = useCallback(async (following_id: string) => {
        if (!state.currentUser) return;

        const isFollowing = state.follows.some(f => f.follower_id === state.currentUser?.id && f.following_id === following_id);

        if (isFollowing) {
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', state.currentUser.id)
                .eq('following_id', following_id);

            if (!error) {
                dispatch({ type: 'SET_FOLLOWS', payload: state.follows.filter(f => !(f.follower_id === state.currentUser?.id && f.following_id === following_id)) });
            }
        } else {
            const { data, error } = await supabase
                .from('follows')
                .insert([{ follower_id: state.currentUser.id, following_id: following_id }])
                .select()
                .single();

            if (!error) {
                dispatch({ type: 'SET_FOLLOWS', payload: [...state.follows, data] });
            }
        }
    }, [state.currentUser, state.follows]);

    const updateProfile = useCallback(async (profileData: Partial<User>) => {
        if (!state.currentUser) return;
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', state.currentUser.id);
        if (error) {
            Alert.alert('Update Error', error.message);
        } else {
            dispatch({ type: 'SET_USER', payload: { ...state.currentUser, ...profileData } });
        }
    }, [state.currentUser]);

    const getQuestStats = useCallback(
        (quest_id: string) => state.quests.find(q => q.quest_id === quest_id)?.stats,
        [state.quests]
    );

    const getQuestRsvps = useCallback(
        (quest_id: string) => state.rsvps.filter((r) => r.quest_id === quest_id),
        [state.rsvps]
    );

    const resendOtp = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });
        if (error) Alert.alert('OTP Error', error.message);
        return { error };
    }, []);

    const verifyOtp = useCallback(async (email: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });
        if (error) Alert.alert('Verification Error', error.message);
        return { error };
    }, []);

    const value: AppContextType = {
        ...state,
        login,
        signup,
        logout,
        selectCampus,
        createQuest,
        createPost,
        startRumor,
        rsvp,
        cancelRsvp,
        followUser,
        updateProfile,
        getQuestStats,
        getQuestRsvps,
        setHasLaunched,
        resendOtp,
        verifyOtp,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
