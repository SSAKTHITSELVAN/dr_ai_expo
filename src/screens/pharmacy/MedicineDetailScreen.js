import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import AIExplanationCard from '../../components/AIExplanationCard';

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
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.emptyText}>Medicine not found.</Text>
                </View>
            </View>
        );
    }

    const { medicine, ai_explanation } = details;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{medicine.name}</Text>
                <View style={styles.separator} />
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Generic Name:</Text>
                    <Text style={styles.detailValue}>{medicine.generic_name}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailValue}>{medicine.category}</Text>
                </View>
                <View style={styles.separator} />
                <Text style={styles.sectionHeader}>Usage</Text>
                <Text style={styles.sectionContent}>{medicine.usage}</Text>
                <Text style={styles.sectionHeader}>Dosage</Text>
                <Text style={styles.sectionContent}>{medicine.dosage}</Text>
            </View>
            {ai_explanation?.explanation && (
                <AIExplanationCard explanation={ai_explanation.explanation} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf5ff',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0d6efd',
        marginBottom: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 15,
        color: '#6c757d',
        marginRight: 10,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212529',
        flex: 1,
        textAlign: 'right',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057',
        marginTop: 10,
    },
    sectionContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#212529',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 16,
        paddingVertical: 20,
    }
});

export default MedicineDetailScreen;