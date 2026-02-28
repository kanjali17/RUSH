import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';

interface RushButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
}

export function RushButton({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    style,
    textStyle,
    icon
}: RushButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary': return styles.secondary;
            case 'ghost': return styles.ghost;
            case 'outline': return styles.outline;
            default: return styles.primary;
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm': return styles.sizeSm;
            case 'lg': return styles.sizeLg;
            default: return styles.sizeMd;
        }
    };

    const getTextColor = () => {
        if (variant === 'primary') return '#fff';
        if (variant === 'outline') return '#ff6b35';
        if (variant === 'secondary') return '#f1f1f5';
        return '#9ca3af';
    };

    return (
        <TouchableOpacity
            style={[styles.base, getVariantStyles(), getSizeStyles(), style]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.text, { color: getTextColor() }, size === 'sm' && styles.textSm, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primary: {
        backgroundColor: '#ff6b35',
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    secondary: {
        backgroundColor: '#22223a',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ff6b35',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    sizeSm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    sizeMd: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    sizeLg: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    text: {
        fontWeight: '700',
        fontSize: 16,
    },
    textSm: {
        fontSize: 14,
    },
});
