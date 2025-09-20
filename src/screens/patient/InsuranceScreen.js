import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { globalStyles } from '../../styles/globalStyles';
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
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>Insurance Helper</Text>
            {recommendations?.ai_recommendations?.recommendations && (
                <AIExplanationCard explanation={recommendations.ai_recommendations.recommendations} />
            )}
            <Text style={[globalStyles.title, {fontSize: 20, marginTop: 20}]}>Available Plans</Text>
            {recommendations?.available_plans.map(plan => (
                <View key={plan.id} style={globalStyles.card}>
                    <Text style={globalStyles.cardTitle}>{plan.name} ({plan.provider})</Text>
                    <Text style={globalStyles.cardSubtitle}>Type: {plan.plan_type}</Text>
                    <Text>Coverage: ₹{plan.coverage_amount}</Text>
                    <Text>Premium: ₹{plan.premium} / year</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default InsuranceScreen;