import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, Switch, ActivityIndicator, Alert,
    TouchableOpacity, Modal, TextInput, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../services/AuthContext';
import api from '../../services/api';

const DoctorDashboard = () => {
    const { authState, logout } = useAuth();
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editData, setEditData] = useState({});

    const fetchDoctorProfile = useCallback(async () => {
        if (!authState.profileId) {
            setError("Could not find profile ID. Please log in again.");
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/doctors/profile/${authState.profileId}`);
            setDoctorData(response.data);
            setEditData(response.data);
        } catch (err) {
            setError("Could not fetch your profile.");
            console.error("Fetch profile error:", err);
        } finally {
            setLoading(false);
        }
    }, [authState.profileId]);

    useEffect(() => {
        fetchDoctorProfile();
    }, [fetchDoctorProfile]);

    const handleAvailabilityChange = async (newStatus) => {
        setDoctorData(prev => ({ ...prev, is_available: newStatus }));
        try {
            await api.put(`/doctors/availability/me?available=${newStatus}`);
        } catch (err) {
            setDoctorData(prev => ({ ...prev, is_available: !newStatus }));
            Alert.alert("Update Failed", "Could not update availability.");
        }
    };

    const openEditModal = () => {
        setEditData(doctorData);
        setModalVisible(true);
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await api.put('/doctors/profile/me', editData);
            setDoctorData(response.data);
            setModalVisible(false);
            Alert.alert("Success", "Your profile has been updated.");
        } catch (error) {
            Alert.alert("Error", "Failed to update profile.");
            console.error("Update profile error", error);
        }
    };

    const handleEditInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0d6efd" style={styles.loader} />;
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Welcome, {doctorData?.name}</Text>
                    <Text style={styles.subtitle}>Your Professional Dashboard</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutIcon}>
                    <MaterialCommunityIcons name="logout" size={28} color="#6c757d" />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.toggleContainer}>
                    <Text style={styles.cardTitle}>Your Status</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                         <Text style={[styles.statusText, {color: doctorData?.is_available ? '#28a745' : '#6c757d'}]}>
                            {doctorData?.is_available ? 'Available' : 'Unavailable'}
                        </Text>
                        <Switch
                            trackColor={{ false: "#d3d3d3", true: "#89cff0" }}
                            thumbColor={doctorData?.is_available ? "#0d6efd" : "#f4f3f4"}
                            onValueChange={handleAvailabilityChange}
                            value={doctorData?.is_available}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Your Profile</Text>
                    <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color="#fff" />
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <InfoRow icon="briefcase-check-outline" label="Specialization" value={doctorData?.specialization} />
                <InfoRow icon="star-circle-outline" label="Experience" value={`${doctorData?.experience} years`} />
                <InfoRow icon="map-marker-outline" label="Location" value={doctorData?.location} />
                <InfoRow icon="phone-outline" label="Phone" value={doctorData?.phone} />
                <InfoRow icon="currency-inr" label="Fee" value={`INR ${doctorData?.consultation_fee}`} />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Your Profile</Text>
                        <ScrollView>
                            <FormInput label="Full Name" value={editData.name} onChangeText={(text) => handleEditInputChange('name', text)} />
                            <FormInput label="Specialization" value={editData.specialization} onChangeText={(text) => handleEditInputChange('specialization', text)} />
                            <FormInput label="Experience (Years)" value={String(editData.experience || '')} onChangeText={(text) => handleEditInputChange('experience', Number(text))} keyboardType="numeric" />
                            <FormInput label="Qualification" value={editData.qualification} onChangeText={(text) => handleEditInputChange('qualification', text)} />
                            <FormInput label="Location" value={editData.location} onChangeText={(text) => handleEditInputChange('location', text)} />
                            <FormInput label="Consultation Fee" value={String(editData.consultation_fee || '')} onChangeText={(text) => handleEditInputChange('consultation_fee', Number(text))} keyboardType="numeric" />
                            <FormInput label="Phone Number" value={editData.phone} onChangeText={(text) => handleEditInputChange('phone', text)} keyboardType="phone-pad" />
                            <FormInput label="WhatsApp Number" value={editData.whatsapp} onChangeText={(text) => handleEditInputChange('whatsapp', text)} keyboardType="phone-pad" />
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdateProfile}>
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <MaterialCommunityIcons name={icon} size={24} color="#0d6efd" style={styles.infoIcon} />
        <View>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const FormInput = ({ label, ...props }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput style={styles.textInput} {...props} />
    </View>
);

// NOTE: All styles are defined once at the bottom
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eaf5ff' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#0d6efd' },
    subtitle: { fontSize: 16, color: '#6c757d' },
    logoutIcon: { padding: 5 },
    card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0d6efd' },
    toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusText: { fontSize: 16, fontWeight: '500', marginRight: 10},
    infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    infoIcon: { marginRight: 15 },
    infoLabel: { fontSize: 14, color: '#6c757d' },
    infoValue: { fontSize: 16, fontWeight: '500', color: '#343a40' },
    editButton: { flexDirection: 'row', backgroundColor: '#0d6efd', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center' },
    editButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0d6efd' },
    inputContainer: { marginBottom: 15 },
    inputLabel: { fontSize: 14, color: '#6c757d', marginBottom: 5 },
    textInput: { borderWidth: 1, borderColor: '#ced4da', borderRadius: 10, padding: 12, fontSize: 16 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
    saveButton: { backgroundColor: '#0d6efd', marginLeft: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#ced4da' },
    cancelButtonText: { color: '#343a40', fontWeight: 'bold', fontSize: 16 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { fontSize: 16, color: '#6c757d', textAlign: 'center', marginBottom: 20 },
});

export default DoctorDashboard;