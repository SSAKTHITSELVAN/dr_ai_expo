import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../services/AuthContext';

const MedicinesListScreen = ({ navigation }) => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await api.get('/pharmacy/medicines');
                setMedicines(response.data);
            } catch (error) {
                Alert.alert("Error", "Could not fetch medicines.");
            } finally {
                setLoading(false);
            }
        };
        fetchMedicines();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    const renderMedicineItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
        >
            <MaterialCommunityIcons name="pill" size={24} color="#0d6efd" style={styles.icon} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.category}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ced4da" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={medicines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMedicineItem}
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No medicines found in your inventory.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContentContainer}
            />
             <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={logout}
            >
                <MaterialCommunityIcons name="logout" size={22} color="#dc3545" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf5ff',
    },
    listContentContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 2,
    },
    emptyCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 16,
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

export default MedicinesListScreen;