import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import api from '../../services/api';
import DoctorCard from '../../components/DoctorCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { globalStyles } from '../../styles/globalStyles';

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
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Available Doctors</Text>
            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <DoctorCard doctor={item} />}
                ListEmptyComponent={<Text style={{textAlign: 'center'}}>No doctors are available right now.</Text>}
            />
        </View>
    );
};

export default DoctorsListScreen;