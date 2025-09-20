import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import AIExplanationCard from '../../components/AIExplanationCard';
import { globalStyles } from '../../styles/globalStyles';

const MedicineDetailScreen = ({ route }) => {
    const { medicineId } = route.params;
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/pharmacy/medicines/${medicineId}`);
                setDetails(response.data);
            } catch (error) {
                Alert.alert("Error", "Could not fetch medicine details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [medicineId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!details) {
        return <Text style={globalStyles.container}>Medicine not found.</Text>;
    }

    const { medicine, ai_explanation } = details;

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.card}>
                <Text style={globalStyles.title}>{medicine.name}</Text>
                <Text style={globalStyles.cardSubtitle}>Generic Name: {medicine.generic_name}</Text>
                <Text style={globalStyles.cardSubtitle}>Category: {medicine.category}</Text>
                <Text style={{marginTop: 10, fontWeight: 'bold'}}>Usage:</Text>
                <Text>{medicine.usage}</Text>
                <Text style={{marginTop: 10, fontWeight: 'bold'}}>Dosage:</Text>
                <Text>{medicine.dosage}</Text>
            </View>
            <AIExplanationCard explanation={ai_explanation?.explanation} />
        </ScrollView>
    );
};

export default MedicineDetailScreen;