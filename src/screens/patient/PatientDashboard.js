import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PatientDashboard = ({ navigation }) => {
    const { logout } = useAuth();
    // If your useAuth() hook also provides user details, you could display the name
    // const { user } = useAuth(); 

    const menuItems = [
        { 
            key: '1', 
            title: 'Find Doctors', 
            screen: 'Find Doctors', 
            icon: 'stethoscope', 
            color: '#3498db' 
        },
        { 
            key: '2', 
            title: 'Scan Prescription', 
            screen: 'Scan Rx', 
            icon: 'scanner', 
            color: '#2ecc71' 
        },
        { 
            key: '3', 
            title: 'Insurance', 
            screen: 'Insurance', 
            icon: 'shield-check-outline', 
            color: '#9b59b6' 
        },
        { 
            key: '4', 
            title: 'Govt. Schemes', 
            screen: 'Schemes', 
            icon: 'bank-outline', 
            color: '#e67e22' 
        },
    ];

    const renderGridItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate(item.screen)}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon} size={40} color="#fff" />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome Back!</Text>
                {/* <Text style={styles.subtitle}>Hello, {user?.name || 'Patient'}</Text> */}
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
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#343a40',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 5,
    },
    gridContainer: {
        paddingHorizontal: 10,
    },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 5,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        textAlign: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f8d7da',
    },
    logoutButtonText: {
        color: '#dc3545',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default PatientDashboard;