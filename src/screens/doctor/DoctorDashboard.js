import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { globalStyles } from '../../styles/globalStyles';

const DoctorDashboard = () => {
    const { logout } = useAuth();
    // In a real app, you would fetch and update the doctor's availability
    
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Doctor Dashboard</Text>
            <View style={globalStyles.card}>
                <Text style={globalStyles.cardTitle}>Manage Availability</Text>
                <Text>Feature coming soon! You will be able to toggle your availability for patient consultations here.</Text>
            </View>
            <TouchableOpacity 
                style={[globalStyles.button, {backgroundColor: '#dc3545', marginTop: 30}]} 
                onPress={logout}
            >
                <Text style={globalStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DoctorDashboard;