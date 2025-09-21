import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import AIExplanationCard from '../../components/AIExplanationCard';

const GovernmentSchemesScreen = () => {
    const [schemes, setSchemes] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authState } = useAuth();

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const response = await api.get(`/patients/government-schemes/${authState.userId}`);
                setSchemes(response.data.schemes);
            } catch (error) {
                Alert.alert("Error", "Could not fetch government schemes.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, [authState.userId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Government Health Schemes</Text>
            {schemes ? (
                <AIExplanationCard explanation={schemes} />
            ) : (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No relevant schemes found at this time.</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf5ff', // Light blue background
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d6efd', // Primary blue
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 16,
        paddingVertical: 20,
    }
});

export default GovernmentSchemesScreen;