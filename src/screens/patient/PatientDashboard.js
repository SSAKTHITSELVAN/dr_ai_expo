import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PatientDashboard = ({ navigation }) => {
    const { logout, authState } = useAuth();
    // To display the user's name, you would need to fetch it using authState.userId
    // and then set it in a state variable.

    const menuItems = [
        { 
            key: '1', 
            title: 'Find Doctors', 
            screen: 'Find Doctors', 
            icon: 'stethoscope', 
            color: '#0d6efd' // Primary Blue
        },
        { 
            key: '2', 
            title: 'Scan Prescription', 
            screen: 'Scan Rx', 
            icon: 'scanner', 
            color: '#28a745' // Green
        },
        { 
            key: '3', 
            title: 'Insurance', 
            screen: 'Insurance', 
            icon: 'shield-check-outline', 
            color: '#6f42c1' // Purple
        },
        { 
            key: '4', 
            title: 'Govt. Schemes', 
            screen: 'Schemes', 
            icon: 'bank-outline', 
            color: '#fd7e14' // Orange
        },
    ];

    const renderGridItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate(item.screen)}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.color, shadowColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon} size={36} color="#fff" />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Patient Dashboard</Text>
                <Text style={styles.subtitle}>How can we help you today?</Text>
            </View>

            <FlatList
                data={menuItems}
                renderItem={renderGridItem}
                keyExtractor={(item) => item.key}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
            />

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <MaterialCommunityIcons name="logout" size={22} color="#dc3545" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf5ff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40, // Extra padding for status bar
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d6efd',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 8,
    },
    gridContainer: {
        paddingHorizontal: 12,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057',
        textAlign: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 15,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dc3545',
    },
    logoutButtonText: {
        color: '#dc3545',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default PatientDashboard;