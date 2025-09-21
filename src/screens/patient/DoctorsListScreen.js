import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import api from '../../services/api';
import DoctorCard from '../../components/DoctorCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const DoctorsListScreen = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/patients/doctors/available');
                setDoctors(response.data);
            } catch (error) {
                Alert.alert("Error", "Could not fetch doctors.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Doctors</Text>
            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <DoctorCard doctor={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No doctors are available right now.</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf5ff',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d6efd',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
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

export default DoctorsListScreen;