import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIExplanationCard = ({ explanation }) => {
    if (!explanation) return null;

    return (
        <View style={styles.aiCard}>
            <Text style={styles.header}>AI Health Assistant Says:</Text>
            <Text style={styles.content}>{explanation}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    aiCard: {
        backgroundColor: '#dbeafe', // A light, friendly blue
        borderRadius: 12,
        padding: 16,
        marginTop: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#0d6efd',
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0d6efd',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default AIExplanationCard;