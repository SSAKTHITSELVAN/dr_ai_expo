import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { globalStyles } from '../../styles/globalStyles';

const PatientDashboard = ({ navigation }) => {
    const { logout } = useAuth();

    const menuItems = [
        { title: 'Find Available Doctors', screen: 'Find Doctors' },
        { title: 'Scan Prescription', screen: 'Scan Rx' },
        { title: 'Insurance Recommendations', screen: 'Insurance' },
        { title: 'Government Health Schemes', screen: 'Schemes' },
    ];

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Patient Dashboard</Text>
            {menuItems.map((item) => (
                <TouchableOpacity 
                    key={item.title} 
                    style={[globalStyles.button, styles.menuButton]} 
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <Text style={globalStyles.buttonText}>{item.title}</Text>
                </TouchableOpacity>
            ))}
             <TouchableOpacity 
                style={[globalStyles.button, {backgroundColor: '#dc3545', marginTop: 30}]} 
                onPress={logout}
            >
                <Text style={globalStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        marginBottom: 15,
        backgroundColor: '#17a2b8'
    }
});

export default PatientDashboard;