import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { globalStyles } from '../../styles/globalStyles';
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

    return (
        <View style={globalStyles.container}>
            <FlatList
                data={medicines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={globalStyles.card}
                        onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
                    >
                        <Text style={globalStyles.cardTitle}>{item.name}</Text>
                        <Text style={globalStyles.cardSubtitle}>{item.category}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center'}}>No medicines found.</Text>}
            />
             <TouchableOpacity 
                style={[globalStyles.button, {backgroundColor: '#dc3545', marginTop: 10}]} 
                onPress={logout}
            >
                <Text style={globalStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MedicinesListScreen;