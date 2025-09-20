import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { globalStyles } from '../../styles/globalStyles';
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
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>Government Health Schemes</Text>
            {schemes ? (
                <AIExplanationCard explanation={schemes} />
            ) : (
                <Text style={{textAlign: 'center'}}>No relevant schemes found at this time.</Text>
            )}
        </ScrollView>
    );
};

export default GovernmentSchemesScreen;