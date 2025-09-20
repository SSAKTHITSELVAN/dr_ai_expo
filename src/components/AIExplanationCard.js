import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const AIExplanationCard = ({ explanation }) => {
    if (!explanation) return null;

    return (
        <View style={[globalStyles.card, styles.aiCard]}>
            <Text style={styles.header}>🤖 AI Health Assistant Says:</Text>
            <Text style={styles.content}>{explanation}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    aiCard: {
        backgroundColor: '#eef8ff',
        borderColor: '#007bff',
        borderWidth: 1,
        marginTop: 15,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0056b3',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default AIExplanationCard;