import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import AIExplanationCard from '../../components/AIExplanationCard';

const InsuranceScreen = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authState } = useAuth();

    useEffect(() => {
        const fetchInsuranceInfo = async () => {
            try {
                const response = await api.get(`/patients/insurance-recommendations/${authState.userId}`);
                setRecommendations(response.data);
            } catch (error) {
                Alert.alert("Error", "Could not fetch insurance recommendations.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsuranceInfo();
    }, [authState.userId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Insurance Helper</Text>
            
            {recommendations?.ai_recommendations?.recommendations ? (
                <AIExplanationCard explanation={recommendations.ai_recommendations.recommendations} />
            ) : (
                !loading && (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No AI recommendations available right now.</Text>
                    </View>
                )
            )}
            
            <Text style={styles.subtitle}>Available Plans</Text>
            
            {recommendations?.available_plans && recommendations.available_plans.length > 0 ? (
                recommendations.available_plans.map(plan => (
                    <View key={plan.id} style={styles.planCard}>
                        <Text style={styles.planTitle}>{plan.name}</Text>
                        <Text style={styles.planProvider}>{plan.provider}</Text>
                        
                        <View style={styles.separator} />
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type:</Text>
                            <Text style={styles.detailValue}>{plan.plan_type}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Coverage:</Text>
                            <Text style={styles.detailValue}>INR {plan.coverage_amount.toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Premium:</Text>
                            <Text style={styles.detailValue}>INR {plan.premium.toLocaleString('en-IN')} / year</Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.planCard}>
                    <Text style={styles.emptyText}>No available plans found based on your profile.</Text>
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
    subtitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0d6efd',
        marginTop: 24,
        marginBottom: 12,
    },
    planCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#0d6efd',
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d6efd', // Use primary blue for the title
    },
    planProvider: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    detailLabel: {
        fontSize: 15,
        color: '#495057',
    },
    detailValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
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

export default InsuranceScreen;