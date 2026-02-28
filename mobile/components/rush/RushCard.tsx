import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';

interface RushCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    title?: string;
    description?: string;
    variant?: 'default' | 'accent' | 'glass';
}

export function RushCard({
    children,
    style,
    title,
    description,
    variant = 'default'
}: RushCardProps) {
    return (
        <View style={[
            styles.base,
            variant === 'accent' && styles.accent,
            variant === 'glass' && styles.glass,
            style
        ]}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description && <Text style={styles.description}>{description}</Text>}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    accent: {
        backgroundColor: 'rgba(255, 107, 53, 0.05)',
        borderColor: 'rgba(255, 107, 53, 0.15)',
    },
    glass: {
        backgroundColor: 'rgba(26, 26, 46, 0.8)',
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: '#ff8c5a',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#9ca3af',
        marginBottom: 12,
    }
});
